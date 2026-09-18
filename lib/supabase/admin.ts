import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Uses the service-role key, which bypasses Row Level Security entirely.
 * The `server-only` import above makes it a build error if any client
 * component (or anything bundled for the browser) ever tries to import this
 * file. Only use this for operations that genuinely require elevated
 * privileges, like deleting an auth user — never for regular reads/writes,
 * which should go through the normal RLS-protected client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client is missing required environment variables.");
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
