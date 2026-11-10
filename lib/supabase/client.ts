import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const isDemoMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co') ||
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

/**
 * Browser-side Supabase client.
 * Safe to call in 'use client' components.
 * Uses @supabase/ssr createBrowserClient for proper cookie-based session handling.
 */
export function getSupabaseBrowserClient() {
  if (isDemoMode) {
    // Lightweight no-op mock so UI doesn't crash in demo/dev mode
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async (_: any) => ({ data: {}, error: null }),
        signUp: async (_: any) => ({ data: {}, error: null }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async (_: any) => ({ error: null }),
        onAuthStateChange: (_cb: any) => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
      },
      from: (_table: string) => ({
        select: (_cols?: string) => ({
          eq: (_col: string, _val: any) => ({
            single: async () => ({ data: null, error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
          order: (_col: string) => ({ data: [], error: null }),
          limit: (_n: number) => ({ data: [], error: null }),
          data: [],
          error: null,
        }),
        insert: async (_values: any) => ({ data: null, error: null }),
        update: (_values: any) => ({
          eq: (_col: string, _val: any) => ({ data: null, error: null }),
          match: (_obj: any) => ({ data: null, error: null }),
        }),
        upsert: async (_values: any) => ({ data: null, error: null }),
        delete: () => ({
          eq: (_col: string, _val: any) => ({ data: null, error: null }),
          match: (_obj: any) => ({ data: null, error: null }),
        }),
      }),
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
