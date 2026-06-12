-- ================================================================
-- CardCraft Pro — Supabase Schema
-- Run this entire file in your Supabase SQL Editor
-- ================================================================

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  email       text,
  company     text,
  avatar_url  text,
  created_at  timestamptz default now() not null
);

-- Business cards saved by users
create table if not exists public.business_cards (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  name        text not null,
  template_id text not null,
  card_data   jsonb not null default '{}',
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- CRM Contacts
create table if not exists public.contacts (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  full_name   text not null,
  email       text,
  phone       text,
  company     text,
  title       text,
  address     text,
  website     text,
  notes       text,
  source      text default 'manual' check (source in ('manual', 'card_share', 'import')),
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- CRM Interaction Log
create table if not exists public.interactions (
  id          uuid default gen_random_uuid() primary key,
  contact_id  uuid references public.contacts on delete cascade not null,
  user_id     uuid references auth.users on delete cascade not null,
  type        text not null check (type in ('note', 'call', 'email', 'meeting')),
  content     text not null,
  created_at  timestamptz default now() not null
);

-- ── Row Level Security ──────────────────────────────────────────

alter table public.profiles       enable row level security;
alter table public.business_cards enable row level security;
alter table public.contacts       enable row level security;
alter table public.interactions   enable row level security;

-- Profiles
create policy "profiles: own select"  on public.profiles for select  using (auth.uid() = id);
create policy "profiles: own insert"  on public.profiles for insert  with check (auth.uid() = id);
create policy "profiles: own update"  on public.profiles for update  using (auth.uid() = id);

-- Cards
create policy "cards: own all"  on public.business_cards for all  using (auth.uid() = user_id);

-- Contacts
create policy "contacts: own all"  on public.contacts for all  using (auth.uid() = user_id);

-- Interactions
create policy "interactions: own all"  on public.interactions for all  using (auth.uid() = user_id);

-- ── Auto-create profile on signup ──────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Updated_at trigger ─────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cards_updated_at   before update on public.business_cards for each row execute procedure public.set_updated_at();
create trigger contacts_updated_at before update on public.contacts        for each row execute procedure public.set_updated_at();
