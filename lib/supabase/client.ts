import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Only ever uses the public URL and the
 * anon/publishable key — both are safe to ship to the client because Row
 * Level Security policies (see supabase/migrations) are what actually
 * enforce access control, not this key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
