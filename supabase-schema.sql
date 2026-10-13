-- Zokro profiles + scores (run once in Supabase SQL Editor)
create table if not exists profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default 'Player',
  avatar text not null default '🎮',
  created_at timestamptz default now()
);
create table if not exists scores(
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  game text not null,
  score int not null,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
alter table scores enable row level security;
drop policy if exists "read all" on profiles; create policy "read all" on profiles for select using (true);
drop policy if exists "own write" on profiles; create policy "own write" on profiles for all using (auth.uid()=id) with check (auth.uid()=id);
drop policy if exists "read all" on scores; create policy "read all" on scores for select using (true);
drop policy if exists "own insert" on scores; create policy "own insert" on scores for insert with check (auth.uid()=user_id);
