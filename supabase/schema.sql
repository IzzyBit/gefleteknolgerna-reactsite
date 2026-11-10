-- Run this in the Supabase SQL Editor. Uses Supabase Auth + Row Level Security (RLS).
-- Public visitors can see only published dates/hours, not volunteer contact details.
-- Admin users must be explicitly granted membership in public.pub_admins.

create extension if not exists pgcrypto;

create table if not exists public.pub_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.pub_admins enable row level security;
revoke all on public.pub_admins from anon, authenticated;
-- No public SELECT/INSERT policies for pub_admins.

create or replace function public.is_pub_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.pub_admins where user_id = auth.uid()
  );
$$;
revoke all on function public.is_pub_admin() from public;
grant execute on function public.is_pub_admin() to authenticated;

create table if not exists public.pub_shifts (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  opens time not null,
  closes time not null,
  work_from time not null,
  work_to time not null,
  helpers_needed integer not null default 0 check (helpers_needed between 0 and 100),
  notes text not null default '' check (length(notes) <= 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.pub_signups (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references public.pub_shifts(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 120),
  contact_method text not null check (contact_method in ('Messenger', 'Instagram', 'WhatsApp', 'E-post', 'Annat')),
  contact_value text not null check (length(trim(contact_value)) between 1 and 200),
  consent boolean not null check (consent = true),
  created_at timestamptz not null default now()
);
create index if not exists pub_signups_shift_idx on public.pub_signups (shift_id);

alter table public.pub_shifts enable row level security;
alter table public.pub_signups enable row level security;
grant select on public.pub_shifts to anon, authenticated;
grant insert, update, delete on public.pub_shifts to authenticated;
grant insert on public.pub_signups to anon, authenticated;
grant select, delete on public.pub_signups to authenticated;

-- Starting fresh: remove policies if the script is run again.
drop policy if exists "Everyone can view pub calendar" on public.pub_shifts;
drop policy if exists "Admins can add pub dates" on public.pub_shifts;
drop policy if exists "Admins can edit pub dates" on public.pub_shifts;
drop policy if exists "Admins can remove pub dates" on public.pub_shifts;
drop policy if exists "Visitors can register with consent" on public.pub_signups;
drop policy if exists "Admins can read signups" on public.pub_signups;
drop policy if exists "Admins can remove signups" on public.pub_signups;

create policy "Everyone can view pub calendar" on public.pub_shifts
  for select to anon, authenticated using (true);
create policy "Admins can add pub dates" on public.pub_shifts
  for insert to authenticated with check (public.is_pub_admin());
create policy "Admins can edit pub dates" on public.pub_shifts
  for update to authenticated using (public.is_pub_admin()) with check (public.is_pub_admin());
create policy "Admins can remove pub dates" on public.pub_shifts
  for delete to authenticated using (public.is_pub_admin());

create policy "Visitors can register with consent" on public.pub_signups
  for insert to anon, authenticated with check (
    consent = true and exists (
      select 1 from public.pub_shifts s
      where s.id = shift_id and s.date >= current_date
    )
  );
create policy "Admins can read signups" on public.pub_signups
  for select to authenticated using (public.is_pub_admin());
create policy "Admins can remove signups" on public.pub_signups
  for delete to authenticated using (public.is_pub_admin());

-- After creating an admin in Supabase Authentication > Users, run:
-- insert into public.pub_admins (user_id) values ('YOUR_AUTH_USER_UUID');
-- No one can grant themselves admin status from the website.

-- Check the organization's data retention practice, remove contact details when
-- no longer needed, enable abuse protection/rate limiting and publish a privacy
-- notice before handling real volunteer contact details.
