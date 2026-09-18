import type { Metadata } from "next";
import { RequestResetForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-sm px-4 py-14">
      <h1 className="font-serif text-2xl font-medium text-ink-900">Reset your password</h1>
      <p className="mt-1 text-sm text-ink-500">
        Enter your email and we'll send you a link to set a new password.
      </p>
      <div className="mt-6">
        <RequestResetForm />
      </div>
    </main>
  );
}
