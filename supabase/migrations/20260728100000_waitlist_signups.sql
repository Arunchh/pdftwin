-- PDF Twin: launch waitlist signups
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  source text not null default 'banner',
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_lower_idx
  on public.waitlist_signups (lower(email));

alter table public.waitlist_signups enable row level security;

create policy "Anyone can join waitlist"
  on public.waitlist_signups
  for insert
  to anon, authenticated
  with check (true);
