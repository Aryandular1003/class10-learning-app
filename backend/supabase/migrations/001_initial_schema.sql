-- BoardReady backend foundation for Supabase/Postgres.
-- Run this migration in the Supabase SQL editor before adding real content.

create type public.app_role as enum ('founder', 'teacher', 'student');
create type public.content_status as enum ('draft', 'in-review', 'approved');
create type public.content_type as enum ('notes', 'pyq', 'practice', 'predicted');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subjects (
  id text primary key,
  label text not null,
  emoji text,
  created_at timestamptz not null default now()
);

create table public.chapters (
  id text primary key,
  subject_id text not null references public.subjects(id) on delete cascade,
  title text not null,
  section text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(subject_id, title)
);

create table public.content_items (
  id text primary key,
  subject_id text not null references public.subjects(id) on delete cascade,
  chapter_id text not null references public.chapters(id) on delete cascade,
  chapter_name text not null,
  content_type public.content_type not null,
  content jsonb not null default '{}'::jsonb,
  status public.content_status not null default 'draft',
  source_refs jsonb not null default '[]'::jsonb,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject_id text not null references public.subjects(id) on delete cascade,
  chapter_id text not null references public.chapters(id) on delete cascade,
  completed boolean not null default false,
  bookmarked boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key(user_id, chapter_id)
);

insert into public.subjects (id, label, emoji) values
  ('hindi', 'Hindi', '🪔'),
  ('english', 'English', '📖'),
  ('math', 'Mathematics', '📐'),
  ('science', 'Science', '🧪'),
  ('social-science', 'Social Science', '🌍')
on conflict (id) do nothing;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('founder', 'teacher')
  );
$$;

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.content_items enable row level security;
alter table public.student_progress enable row level security;

create policy "Users can view their profile" on public.profiles
  for select using (id = auth.uid());
create policy "Users can update their profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "Authenticated users can read subjects" on public.subjects
  for select to authenticated using (true);
create policy "Authenticated users can read chapters" on public.chapters
  for select to authenticated using (true);
create policy "Authenticated users can read approved content" on public.content_items
  for select to authenticated using (status = 'approved' or public.is_staff());
create policy "Staff can create content" on public.content_items
  for insert to authenticated with check (public.is_staff());
create policy "Staff can update content" on public.content_items
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Students can manage their progress" on public.student_progress
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
