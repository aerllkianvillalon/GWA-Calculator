"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "sent">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords don't match.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    const redirect = searchParams.get("redirect") ?? "/dashboard";
    const restore = searchParams.get("restore");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
          redirect
        )}${restore ? "&restore=1" : ""}`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(
        error.message.toLowerCase().includes("already registered")
          ? "An account with that email already exists."
          : "We couldn't create your account. Please try again."
      );
      return;
    }

    // Supabase returns a fake success (no error) when the email is already
    // registered and confirmed, to prevent account enumeration. A genuinely
    // new sign-up has at least one identity attached; an existing account
    // comes back with an empty identities array.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setStatus("error");
      setMessage("An account with that email already exists.");
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <Alert tone="success">
        Check your email for a confirmation link to finish creating your account.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        label="Password"
        autoComplete="new-password"
        required
        hint="At least 8 characters."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordInput
        label="Confirm password"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {status === "error" && <Alert tone="error">{message}</Alert>}

      <Button type="submit" isLoading={status === "loading"}>
        Create account
      </Button>

      <p className="text-xs text-ink-500">
        We only ask for an email and password. See our{" "}
        <a href="/privacy" className="underline">
          privacy notice
        </a>{" "}
        for what we store.
      </p>
    </form>
  );
}
