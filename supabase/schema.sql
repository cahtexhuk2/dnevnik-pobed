-- Дневник Побед: базовая Supabase-схема.
-- Выполнять в Supabase SQL Editor после создания проекта.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  birth_year int check (birth_year between 1900 and extract(year from now())::int),
  city text,
  bio text,
  journey_start_date date default date '2026-05-26',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null default 'simple' check (type in ('simple', 'compound')),
  challenge_days int not null default 90,
  color text not null default 'green',
  is_core boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_children (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  child_id uuid references public.habit_children(id) on delete cascade,
  check_date date not null,
  done boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, habit_id, child_id, check_date)
);

create table if not exists public.victories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  victory_date date not null default current_date,
  text text not null,
  category text,
  role text,
  tags text[] not null default '{}',
  image_url text,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shadow_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  situation text not null,
  pattern text,
  fear text,
  mature_action text,
  repair_step text,
  status text not null default 'открыто',
  tags text[] not null default '{}',
  converted_victory_id uuid references public.victories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  victory_voice_enabled boolean not null default false,
  voice_mode text not null default 'calm',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists habits_touch_updated_at on public.habits;
create trigger habits_touch_updated_at
before update on public.habits
for each row execute function public.touch_updated_at();

drop trigger if exists habit_checks_touch_updated_at on public.habit_checks;
create trigger habit_checks_touch_updated_at
before update on public.habit_checks
for each row execute function public.touch_updated_at();

drop trigger if exists victories_touch_updated_at on public.victories;
create trigger victories_touch_updated_at
before update on public.victories
for each row execute function public.touch_updated_at();

drop trigger if exists shadow_entries_touch_updated_at on public.shadow_entries;
create trigger shadow_entries_touch_updated_at
before update on public.shadow_entries
for each row execute function public.touch_updated_at();

drop trigger if exists user_settings_touch_updated_at on public.user_settings;
create trigger user_settings_touch_updated_at
before update on public.user_settings
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_children enable row level security;
alter table public.habit_checks enable row level security;
alter table public.victories enable row level security;
alter table public.shadow_entries enable row level security;
alter table public.user_settings enable row level security;

create policy "profiles are owned by users"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "habits are owned by users"
on public.habits for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "habit children are owned by users"
on public.habit_children for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "habit checks are owned by users"
on public.habit_checks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "victories are owned by users"
on public.victories for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "shadow entries are owned by users"
on public.shadow_entries for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "settings are owned by users"
on public.user_settings for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('victory-media', 'victory-media', true)
on conflict (id) do nothing;

create policy "users can upload own media"
on storage.objects for insert
with check (
  bucket_id = 'victory-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "users can update own media"
on storage.objects for update
using (
  bucket_id = 'victory-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "users can delete own media"
on storage.objects for delete
using (
  bucket_id = 'victory-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "public can read victory media"
on storage.objects for select
using (bucket_id = 'victory-media');
