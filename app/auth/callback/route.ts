import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase redirects here after email confirmation / password-reset links.
 * We exchange the one-time code for a session (server-side, via secure
 * cookies) and then send the person on to wherever they were headed.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const restore = searchParams.get("restore");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const destination = restore ? `${redirect}?restore=1` : redirect;
  return NextResponse.redirect(`${origin}${destination}`);
}
