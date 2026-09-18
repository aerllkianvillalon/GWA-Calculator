import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordConfirmPage() {
  return (
    <main className="mx-auto max-w-sm px-4 py-14">
      <h1 className="font-serif text-2xl font-medium text-ink-900">Set a new password</h1>
      <div className="mt-6">
        <UpdatePasswordForm />
      </div>
    </main>
  );
}
