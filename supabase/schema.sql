-- ConstrAI — database schema for Supabase
-- Run this once in the Supabase SQL Editor (Dashboard → SQL → New query → paste → Run).
-- Safe to re-run.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────
create table if not exists public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.org_members (
  org_id uuid not null references public.orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  name text not null,
  location text,
  code text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  name text not null,
  location text,
  on_time_rate numeric not null default 0.8,
  avg_lead_days int not null default 14,
  created_at timestamptz not null default now()
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  name text not null,
  unit text not null default 'units',
  qty numeric not null default 1,
  status text not null default 'ordered',
  need_by date,
  expected_arrival date,
  on_time_probability numeric not null default 0.8,
  cost_of_delay_per_day numeric not null default 0,
  building_delay_days int not null default 0,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists materials_org_idx on public.materials(org_id);
create index if not exists suppliers_org_idx on public.suppliers(org_id);
create index if not exists projects_org_idx on public.projects(org_id);

-- ─────────────────────────────────────────────────────────────
-- Membership helper (security definer → avoids RLS recursion)
-- ─────────────────────────────────────────────────────────────
create or replace function public.is_org_member(o uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.org_members m
    where m.org_id = o and m.user_id = auth.uid()
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table public.orgs enable row level security;
alter table public.org_members enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.suppliers enable row level security;
alter table public.materials enable row level security;

-- profiles: you can see/edit only your own
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- orgs: members can read; the creator can insert; owners can update/delete
drop policy if exists orgs_select on public.orgs;
create policy orgs_select on public.orgs for select using (public.is_org_member(id));
drop policy if exists orgs_insert on public.orgs;
create policy orgs_insert on public.orgs for insert with check (created_by = auth.uid());
drop policy if exists orgs_modify on public.orgs;
create policy orgs_modify on public.orgs for update using (public.is_org_member(id)) with check (public.is_org_member(id));

-- org_members: members can read the membership of orgs they belong to
drop policy if exists members_select on public.org_members;
create policy members_select on public.org_members for select using (public.is_org_member(org_id));
drop policy if exists members_insert on public.org_members;
create policy members_insert on public.org_members for insert with check (public.is_org_member(org_id) or user_id = auth.uid());
drop policy if exists members_delete on public.org_members;
create policy members_delete on public.org_members for delete using (public.is_org_member(org_id));

-- org-scoped data tables: full access for members of the org
do $$
declare t text;
begin
  foreach t in array array['projects','suppliers','materials'] loop
    execute format('drop policy if exists %I_all on public.%I;', t, t);
    execute format(
      'create policy %I_all on public.%I for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));',
      t, t
    );
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────
-- On new signup: create profile + org + owner membership + seed sample data
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org uuid;
  proj uuid;
  s_atlas uuid;
  s_terra uuid;
  s_nordic uuid;
  s_vitro uuid;
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);

  insert into public.orgs (name, created_by)
  values (coalesce(nullif(new.raw_user_meta_data->>'company', ''), 'My Company'), new.id)
  returning id into new_org;

  insert into public.org_members (org_id, user_id, role) values (new_org, new.id, 'owner');

  insert into public.projects (org_id, name, location, code)
  values (new_org, 'My First Project', 'Austin, TX', 'PRJ-1')
  returning id into proj;

  insert into public.suppliers (org_id, name, location, on_time_rate, avg_lead_days)
  values (new_org, 'Atlas Rebar & Steel', 'San Antonio, TX', 0.64, 21) returning id into s_atlas;
  insert into public.suppliers (org_id, name, location, on_time_rate, avg_lead_days)
  values (new_org, 'TerraMix Concrete', 'Austin, TX', 0.95, 3) returning id into s_terra;
  insert into public.suppliers (org_id, name, location, on_time_rate, avg_lead_days)
  values (new_org, 'Nordic HVAC Systems', 'Dallas, TX', 0.86, 45) returning id into s_nordic;
  insert into public.suppliers (org_id, name, location, on_time_rate, avg_lead_days)
  values (new_org, 'Vitro Curtainwall', 'Monterrey, MX', 0.55, 60) returning id into s_vitro;

  insert into public.materials
    (org_id, project_id, supplier_id, name, unit, qty, status, need_by, expected_arrival,
     on_time_probability, cost_of_delay_per_day, building_delay_days, location, notes)
  values
    (new_org, proj, s_atlas, 'Steel Rebar — Level 3 Slab', 'tons', 18.4, 'fabricating',
      (now()::date), (now()::date + 3), 0.22, 22000, 4, 'Grid B3–D6, Level 3',
      'Being made. Photo check showed 2 bundles with the wrong tag.'),
    (new_org, proj, s_terra, 'Ready-Mix Concrete — L3 Pour', 'cu yd', 420, 'approved',
      (now()::date), (now()::date), 0.95, 22000, 0, 'Level 3 slab',
      'Ready on time, but waiting on the steel to arrive first.'),
    (new_org, proj, s_nordic, 'Air Handling Units — L4', 'units', 2, 'in_transit',
      (now()::date + 17), (now()::date + 14), 0.83, 24500, 0, 'Mechanical Room L4',
      'On the way from Dallas.'),
    (new_org, proj, s_vitro, 'Curtainwall Units — East Elevation', 'units', 320, 'fabricating',
      (now()::date + 19), (now()::date + 27), 0.18, 27000, 6, 'East elevation, L2–L8',
      'Paperwork not approved yet, so work is partly stopped.');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
