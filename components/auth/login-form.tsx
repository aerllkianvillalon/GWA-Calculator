"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      // Supabase error messages are already safe to show (no stack traces,
      // no internal details), but we keep the wording generic on purpose.
      setMessage("That email and password combination didn't work. Please try again.");
      return;
    }

    const redirect = searchParams.get("redirect") ?? "/dashboard";
    const restore = searchParams.get("restore");
    router.push(restore ? `${redirect}?restore=1` : redirect);
    router.refresh();
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
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {status === "error" && <Alert tone="error">{message}</Alert>}

      <Button type="submit" isLoading={status === "loading"}>
        Log in
      </Button>

      <p className="text-sm text-ink-500">
        <Link href="/reset-password" className="underline">
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}
