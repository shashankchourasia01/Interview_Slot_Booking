-- Enable UUID generation
create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time text not null,
  name text not null,
  company text not null,
  created_at timestamptz not null default now(),
  constraint bookings_date_time_unique unique (date, time)
);

alter table public.bookings enable row level security;

-- Public frontend access policy (anon key usage)
drop policy if exists "Allow read bookings" on public.bookings;
drop policy if exists "Allow insert bookings" on public.bookings;
drop policy if exists "Allow delete bookings" on public.bookings;

create policy "Allow read bookings"
on public.bookings
for select
to anon
using (true);

create policy "Allow insert bookings"
on public.bookings
for insert
to anon
with check (true);

create policy "Allow delete bookings"
on public.bookings
for delete
to anon
using (true);

-- Realtime publication
alter publication supabase_realtime add table public.bookings;
