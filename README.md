# GWA Calculator

A free General Weighted Average (GWA) calculator for college students. Works
immediately as a guest — no account needed — with optional accounts for
saving calculations.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase (Auth +
Postgres), and Zod.

## Features

- Guest-friendly calculator: add/remove subjects, enter units and grades,
  calculate GWA, see a full breakdown — all computed client-side, nothing
  sent to a server unless you choose to save.
- Configurable grading systems (Philippine 1.00–5.00, percentage, 4.0 GPA),
  defined as data so new scales can be added without touching calculation
  logic.
- Target GWA comparison and a "what-if" grade preview.
- Optional accounts (Supabase Auth): register, log in, log out, reset
  password, save/view/delete calculations, delete account.
- Row Level Security on every user-owned table — one user can never read,
  edit, or delete another user's saved calculations.
- Server-side recomputation of the GWA before saving — the server never
  trusts a GWA value sent from the browser.

## Project structure

```
app/
  page.tsx              landing page + calculator
  calculator/           dedicated /calculator route
  login/ register/      auth pages
  reset-password/       password reset request + confirm
  dashboard/            saved calculations (authenticated)
  settings/             account settings, password change, delete account
  privacy/              privacy notice
  auth/callback/        Supabase email-link callback
  api/calculations/     create/delete saved calculations
  api/account/          delete account

components/
  calculator/  auth/  dashboard/  ui/

lib/
  supabase/     browser + server + admin Supabase clients
  validation/   Zod schemas shared by client and server
  calculator/   pure calculation engine + grading systems + parsing

types/
supabase/migrations/    SQL schema + RLS policies
tests/                  Vitest unit tests
```

## 1. Local development

```bash
npm install
cp .env.example .env.local   # fill in the Supabase values, see below
npm run dev
```

The app runs at http://localhost:3000. The calculator itself works with no
environment variables at all — only auth/save features need Supabase.

## 2. Supabase setup

1. Create a project at https://supabase.com.
2. In **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only —
     see the security notes below)
3. Run the migration in `supabase/migrations/0001_saved_calculations.sql`
   using the SQL editor in the Supabase dashboard (or `supabase db push` if
   you use the Supabase CLI with this repo's `supabase/` folder).
4. In **Authentication → URL Configuration**, set your Site URL and add
   `<your-site>/auth/callback` to the redirect allow list (and
   `http://localhost:3000/auth/callback` for local dev).
5. Email confirmation is on by default for `signUp`; you can turn it off in
   **Authentication → Providers → Email** for faster local testing.

## 3. Environment variables

See `.env.example`. In short:

| Variable | Exposed to browser? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public key; RLS enforces access, not this key |
| `NEXT_PUBLIC_SITE_URL` | Yes | Used for metadata + email redirect links |
| `SUPABASE_SERVICE_ROLE_KEY` | **No — server only** | Bypasses RLS; only used to delete accounts |

Set these in Vercel under **Project Settings → Environment Variables** for
production. Never commit `.env.local`.

## 4. Database schema & RLS

`supabase/migrations/0001_saved_calculations.sql` creates `saved_calculations`
with:

- `user_id` referencing `auth.users`, `on delete cascade` (deleting a user
  removes their saved calculations automatically).
- An index on `(user_id, created_at desc)` for fast dashboard queries.
- Row Level Security **enabled and forced**, with a separate policy per
  operation (`select`, `insert`, `update`, `delete`), each checking
  `auth.uid() = user_id`.
- No grants for the `anon` role at all — guest calculator use never touches
  this table, by design.

## 5. Running tests

```bash
npm test
```

Covers the calculation engine (single/multiple subjects, different unit
weights, decimal grades and units, invalid input, zero units, empty input,
rounding behavior) and a static check that the RLS migration enforces
per-user ownership on every operation. For a full authorization test against
a live database, create two test users against a real Supabase project and
confirm user A's session cannot read/update/delete user B's saved
calculation — the policies in the migration are what make that fail safely.

## 6. Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it in Vercel.
3. Add the environment variables from `.env.example` in Vercel's project
   settings (Production, and Preview if you want preview deployments to work
   against a Supabase project too).
4. Set `NEXT_PUBLIC_SITE_URL` to your real production URL, and add
   `https://<your-domain>/auth/callback` to Supabase's redirect allow list.
5. Deploy.

## 7. Production security checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set only as a server-side Vercel env var,
      never with a `NEXT_PUBLIC_` prefix, and isn't referenced from any file
      imported by a client component (`lib/supabase/admin.ts` guards this
      with the `server-only` package).
- [ ] RLS migration has been applied to the production database, and
      `select * from pg_policies where tablename = 'saved_calculations';`
      shows all four policies.
- [ ] Supabase Auth redirect URLs are locked down to your real domain(s).
- [ ] Email confirmation is enabled in production (it can be convenient to
      disable it for local dev, but re-enable it before going live).
- [ ] The in-memory rate limiter in `lib/rate-limit.ts` is a per-instance,
      best-effort limiter — fine for a demo, but for real traffic replace it
      with a shared store (e.g. Upstash Redis) so limits hold across
      serverless instances.
- [ ] `npm audit` / Dependabot is set up, since dependency versions drift.
- [ ] Error responses returned to the client never include raw database
      errors or stack traces (checked throughout `app/api/*`).

## Notes on grading systems

Grading policies vary by school: passing marks, honors cutoffs, and how
subjects like PE or NSTP are treated all differ. This calculator computes a
straightforward weighted average from the numbers you enter — treat the
result as a close estimate and confirm anything that matters (scholarships,
latin honors, probation) against your registrar's own computation. New
grading scales can be added in `lib/calculator/grading-systems.ts` without
touching the calculation engine or the UI.
