import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Reads/writes the auth session via HTTP-only cookies
 * managed by @supabase/ssr — never via localStorage — so sessions are safe
 * from XSS-based token theft and work with SSR.
 *
 * This still only uses the anon/publishable key. The service-role key (see
 * service-role.ts) is intentionally kept separate and is never imported by
 * any file that also runs in the browser.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // Called from a Server Component render, where cookies can't be
            // written. Safe to ignore — the middleware refreshes the session
            // on the next request instead.
          }
        },
      },
    }
  );
}
