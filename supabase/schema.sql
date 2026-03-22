create extension if not exists pgcrypto;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  summary text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists notes_created_at_idx on public.notes (created_at desc);
create index if not exists notes_tags_idx on public.notes using gin (tags);

alter table public.notes enable row level security;
