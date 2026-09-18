import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SavedCalculationRow } from "@/types/database";
import { CalculationCard } from "@/components/dashboard/calculation-card";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login?redirect=/dashboard");
  }

  // RLS ensures this query can only ever return rows owned by this user,
  // even though we don't filter by user_id explicitly here.
  const { data, error } = await supabase
    .from("saved_calculations")
    .select("*")
    .order("created_at", { ascending: false });

  const calculations = (data ?? []) as SavedCalculationRow[];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium text-ink-900">Your saved GWAs</h1>
        <LogoutButton />
      </div>
      <p className="mt-1 text-sm text-ink-500">
        <Link href="/" className="underline">
          Home
        </Link>{" "}
        {calculations.length > 0 && (
          <>
            ·{" "}
            <Link href="/calculator" className="underline">
              Calculate a new one
            </Link>{" "}
          </>
        )}
        ·{" "}
        <Link href="/settings" className="underline">
          Settings
        </Link>
      </p>

      {error && (
        <p className="mt-6 text-sm text-danger-600">
          Couldn't load your saved calculations right now. Please refresh the page.
        </p>
      )}

      {!error && calculations.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-lg border border-dashed border-ink-100 bg-paper-raised px-8 py-12 text-center">
          <svg
            className="h-10 w-10 text-ink-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l4.414 4.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"
            />
          </svg>
          <div>
            <p className="font-serif text-lg font-medium text-ink-900">You haven't saved a GWA yet.</p>
            <p className="mt-1 text-sm text-ink-500">
              Calculate your GWA and save it here to keep a record you can come back to.
            </p>
          </div>
          <Link href="/calculator" className="mt-1">
            <Button type="button" variant="primary" size="sm">
              Calculate your GWA
            </Button>
          </Link>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {calculations.map((calc) => (
          <CalculationCard key={calc.id} calculation={calc} />
        ))}
      </div>
    </main>
  );
}
