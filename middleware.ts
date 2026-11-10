import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname, searchParams } = request.nextUrl;
  const subdomainParam = searchParams.get('subdomain');

  // ── 1. Subdomain Detection (crm, lms, api, or main) ──
  let detectedSubdomain: 'crm' | 'lms' | 'api' | 'main' = 'main';

  if (host.startsWith('crm.') || subdomainParam === 'crm') {
    detectedSubdomain = 'crm';
  } else if (host.startsWith('lms.') || subdomainParam === 'lms') {
    detectedSubdomain = 'lms';
  } else if (host.startsWith('api.') || subdomainParam === 'api') {
    detectedSubdomain = 'api';
  }

  // Clone URL for internal rewriting
  const url = request.nextUrl.clone();

  // Attach subdomain and hostname headers for downstream server components & APIs
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-subdomain', detectedSubdomain);
  requestHeaders.set('x-hostname', host);

  // ── 2. Subdomain URL Rewriting ──
  let isRewritten = false;

  // CRM Subdomain routing: crm.tejas.ac.in -> /crm/*
  if (detectedSubdomain === 'crm' && !pathname.startsWith('/crm') && !pathname.startsWith('/api')) {
    url.pathname = `/crm${pathname === '/' ? '' : pathname}`;
    isRewritten = true;
  }

  // LMS Subdomain routing: lms.tejas.ac.in -> /dashboard/*
  if (detectedSubdomain === 'lms' && !pathname.startsWith('/dashboard') && !pathname.startsWith('/api')) {
    url.pathname = `/dashboard${pathname === '/' ? '' : pathname}`;
    isRewritten = true;
  }

  // API Subdomain routing: api.tejas.ac.in -> /api/v1/*
  if (detectedSubdomain === 'api' && !pathname.startsWith('/api')) {
    url.pathname = `/api/v1${pathname === '/' ? '' : pathname}`;
    isRewritten = true;
  }

  // Handle rewrite or forward
  let response = isRewritten
    ? NextResponse.rewrite(url, { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } });

  // ── 3. Supabase Auth Session Refresh & Route Protection ──
  const isDemoMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co') ||
    process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }: any) => request.cookies.set(name, value));
          if (isRewritten) {
            response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
          } else {
            response = NextResponse.next({ request: { headers: requestHeaders } });
          }
          cookiesToSet.forEach(({ name, value, options }: any) =>
            response.cookies.set(name, value, {
              ...options,
              // Support cross-subdomain cookie sharing if on apex domain
              domain: host.includes('tejas.bhashaai.in')
                ? '.tejas.bhashaai.in'
                : host.includes('tejas.ac.in')
                ? '.tejas.ac.in'
                : undefined,
            })
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protected route checking
  const protectedPrefixes = ['/dashboard', '/crm', '/test-data', '/tester-activity', '/admin'];
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix) || url.pathname.startsWith(prefix));

  if (isProtected && !user && !isDemoMode) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = '/auth/signin';
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect signed-in users away from auth pages
  const authPages = ['/auth/signin', '/auth/signup'];
  if (authPages.includes(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public assets
     * - API routes (handled with CORS)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
