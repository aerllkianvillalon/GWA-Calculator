import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

export async function DELETE(_request: NextRequest) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(`delete-account:${userData.user.id}`, 3, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ message: "Please wait a moment and try again." }, { status: 429 });
  }

  const admin = createAdminClient();

  // saved_calculations rows are removed automatically via ON DELETE CASCADE
  // (see supabase/migrations), so deleting the auth user is enough.
  const { error } = await admin.auth.admin.deleteUser(userData.user.id);

  if (error) {
    console.error("Failed to delete account:", error.message);
    return NextResponse.json(
      { message: "Couldn't delete your account right now. Please try again." },
      { status: 500 }
    );
  }

  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
