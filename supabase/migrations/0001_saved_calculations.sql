-- GWA Calculator: saved_calculations table
-- Run this in the Supabase SQL editor, or via `supabase db push` if you use
-- the Supabase CLI with this file under supabase/migrations.

create extension if not exists "pgcrypto";

create table if not exists public.saved_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text check (char_length(name) <= 120),
  grading_system_id text not null check (char_length(grading_system_id) <= 64),
  gwa numeric(5, 2) not null,
  total_units numeric(6, 2) not null check (total_units > 0),
  subjects jsonb not null,
  semester text check (char_length(semester) <= 60),
  academic_year text check (char_length(academic_year) <= 20),
  school_or_program text check (char_length(school_or_program) <= 120),
  created_at timestamptz not null default now()
);

comment on table public.saved_calculations is
  'One row per GWA calculation a user has chosen to save. Guest calculations never reach this table.';

-- Fast lookups for "my saved calculations, newest first".
create index if not exists saved_calculations_user_id_created_at_idx
  on public.saved_calculations (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- RLS is the actual enforcement mechanism for "users can only see their own
-- data" — the anon/publishable key used by the browser has no special
-- privileges beyond what these policies grant.

alter table public.saved_calculations enable row level security;
-- Belt-and-suspenders: force RLS even for the table owner role.
alter table public.saved_calculations force row level security;

drop policy if exists "select_own_calculations" on public.saved_calculations;
create policy "select_own_calculations"
  on public.saved_calculations
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "insert_own_calculations" on public.saved_calculations;
create policy "insert_own_calculations"
  on public.saved_calculations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "update_own_calculations" on public.saved_calculations;
create policy "update_own_calculations"
  on public.saved_calculations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "delete_own_calculations" on public.saved_calculations;
create policy "delete_own_calculations"
  on public.saved_calculations
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- No policy exists for the `anon` role at all, so unauthenticated requests
-- (guest calculator usage) can never read or write this table — which
-- matches the requirement that guest calculations stay client-side.

-- ---------------------------------------------------------------------------
-- Grants (principle of least privilege)
-- ---------------------------------------------------------------------------
-- RLS restricts *rows*; grants restrict *operations*. Both are needed.

revoke all on public.saved_calculations from anon;
grant select, insert, update, delete on public.saved_calculations to authenticated;
