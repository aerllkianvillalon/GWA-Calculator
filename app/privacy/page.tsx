import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy notice" };
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="mt-4 font-serif text-2xl font-medium text-ink-900">Privacy notice</h1>
      <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-ink-700">
        <section>
          <h2 className="font-serif text-lg font-medium text-ink-900">
            Using the calculator without an account
          </h2>
          <p className="mt-1">
            You can calculate your GWA without creating an account. Your subjects, units, and
            grades are processed entirely in your browser and are never sent to our servers or
            stored anywhere unless you explicitly choose to save a result.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-medium text-ink-900">If you create an account</h2>
          <p className="mt-1">We store:</p>
          <ul className="mt-1 list-disc pl-5">
            <li>Your email address and a securely hashed password (we never see or store the plaintext password).</li>
            <li>
              Any GWA calculations you explicitly save: subject names, units, grades, the
              resulting GWA, and any optional labels you add (calculation name, semester,
              academic year, school/program).
            </li>
          </ul>
          <p className="mt-2">We do not collect or ask for:</p>
          <ul className="mt-1 list-disc pl-5">
            <li>Student ID numbers or other government IDs</li>
            <li>Home addresses</li>
            <li>Phone numbers</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-lg font-medium text-ink-900">Who can see your data</h2>
          <p className="mt-1">
            Saved calculations are protected by database-level access rules (Row Level Security),
            so only you can read, edit, or delete your own saved calculations — not other users,
            and not through the public API.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-medium text-ink-900">Deleting your data</h2>
          <p className="mt-1">
            You can delete any saved calculation individually from your dashboard, or delete your
            entire account (and all associated data) from your account settings.
          </p>
        </section>
      </div>
      <div className="mt-8 text-right">
        <Link href="/" className="text-sm text-ink-700 underline">
          Back to home →
        </Link>
      </div>
    </main>
  );
}
