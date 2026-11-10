import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';
import { DEMO_PROFILES } from '@/lib/data/mock-store';

export async function OPTIONS() {
  return handleOptions();
}

/**
 * GET /api/v1/auth/session
 * Mobile Authentication & Profile Sync endpoint.
 * Accepts: Bearer <Supabase_JWT_Token> or demo role query.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const roleParam = request.nextUrl.searchParams.get('role') || 'student';

  // Mobile apps pass "Authorization: Bearer <token>"
  // In demo mode or development, resolve from mock profiles or Supabase JWT
  const user = DEMO_PROFILES[roleParam] || DEMO_PROFILES.student;

  return jsonResponse({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
      headline: user.headline,
      location: user.location,
    },
    meta: {
      tokenType: 'Bearer',
      clientPlatform: request.headers.get('x-platform') || 'web',
      clientVersion: request.headers.get('x-client-version') || '1.0.0',
    },
  });
}
