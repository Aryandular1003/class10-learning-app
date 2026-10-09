-- BoardReady / RBSE Class 10
-- Updated learning schema for the current frontend.
-- Run after migrations 001_initial_schema.sql through 005_progress_and_security.sql.
-- This migration is additive and safe to re-run.

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Profile entitlement state
-- -----------------------------------------------------------------------------

alter table public.profiles
  add column if not exists is_premium boolean not null default false,
  add column if not exists premium_since timestamptz;

-- The client may read entitlement state, but must never grant itself PRO access.
revoke update (is_premium, premium_since) on public.profiles from authenticated;

-- -----------------------------------------------------------------------------
-- Question bank
-- -----------------------------------------------------------------------------

create table if not exists public.questions (
  id text primary key,
  subject_id text references public.subjects(id) on delete cascade,
  chapter_id text references public.chapters(id) on delete cascade,
  topic text,
  question text not null,
  answer text not null,
  detailed_explanation text,
  keywords jsonb not null default '[]'::jsonb,
  solution_steps jsonb,
  options jsonb,
  correct_option text,
  question_type text not null default 'practice',
  marks integer not null default 1 check (marks > 0),
  difficulty text not null default 'medium',
  priority text not null default 'practice',
  source text,
  year integer,
  is_pyq boolean not null default false,
  is_predicted boolean not null default false,
  prediction_level text,
  prediction_reason text,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_options (
  id text primary key,
  question_id text not null references public.questions(id) on delete cascade,
  option_letter text not null,
  option_text text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now(),
  unique (question_id, option_letter)
);

create table if not exists public.pyqs (
  id text primary key,
  question_id text references public.questions(id) on delete set null,
  subject_id text references public.subjects(id) on delete cascade,
  chapter_id text references public.chapters(id) on delete cascade,
  topic text,
  year integer not null,
  question text not null,
  answer text not null,
  marks integer not null default 1 check (marks > 0),
  question_type text not null default 'short',
  source text,
  difficulty text not null default 'medium',
  created_at timestamptz not null default now()
);

create table if not exists public.predicted_questions (
  id text primary key,
  question_id text references public.questions(id) on delete cascade,
  subject_id text references public.subjects(id) on delete cascade,
  chapter_id text references public.chapters(id) on delete cascade,
  topic text,
  prediction_level text not null,
  prediction_reason text not null,
  related_pyq_ids jsonb not null default '[]'::jsonb,
  expected_marks integer not null default 1 check (expected_marks > 0),
  is_premium boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Quizzes and mock tests
-- -----------------------------------------------------------------------------

create table if not exists public.quizzes (
  id text primary key,
  chapter_id text references public.chapters(id) on delete cascade,
  subject_id text references public.subjects(id) on delete cascade,
  title text not null,
  total_marks integer not null default 10 check (total_marks > 0),
  duration_minutes integer not null default 15 check (duration_minutes > 0),
  quiz_type text not null default 'chapter_quiz',
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  quiz_id text not null references public.quizzes(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  order_index integer not null default 0,
  primary key (quiz_id, question_id)
);

create table if not exists public.mock_tests (
  id text primary key,
  subject_id text references public.subjects(id) on delete cascade,
  title text not null,
  level text not null default 'Full Mock Test',
  total_marks integer not null default 80 check (total_marks > 0),
  duration_minutes integer not null default 195 check (duration_minutes > 0),
  difficulty text not null default 'medium',
  is_premium boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mock_test_questions (
  mock_test_id text not null references public.mock_tests(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  order_index integer not null default 0,
  primary key (mock_test_id, question_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id text references public.quizzes(id) on delete set null,
  score integer not null default 0 check (score >= 0),
  total_marks integer not null check (total_marks > 0),
  accuracy integer not null default 0 check (accuracy between 0 and 100),
  correct_count integer not null default 0 check (correct_count >= 0),
  incorrect_count integer not null default 0 check (incorrect_count >= 0),
  attempted_count integer not null default 0 check (attempted_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Bring tables from the earlier additive draft up to the current shape.
alter table public.quizzes
  add column if not exists is_premium boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

alter table public.mock_tests
  add column if not exists updated_at timestamptz not null default now();

alter table public.quiz_attempts
  add column if not exists metadata jsonb not null default '{}'::jsonb;

-- -----------------------------------------------------------------------------
-- Shared updated_at trigger
-- -----------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists questions_touch_updated_at on public.questions;
create trigger questions_touch_updated_at before update on public.questions
for each row execute function public.touch_updated_at();

drop trigger if exists predicted_questions_touch_updated_at on public.predicted_questions;
create trigger predicted_questions_touch_updated_at before update on public.predicted_questions
for each row execute function public.touch_updated_at();

drop trigger if exists quizzes_touch_updated_at on public.quizzes;
create trigger quizzes_touch_updated_at before update on public.quizzes
for each row execute function public.touch_updated_at();

drop trigger if exists mock_tests_touch_updated_at on public.mock_tests;
create trigger mock_tests_touch_updated_at before update on public.mock_tests
for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- Access helpers and RLS
-- -----------------------------------------------------------------------------

create or replace function public.is_premium_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_premium = true
  );
$$;

alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.pyqs enable row level security;
alter table public.predicted_questions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.mock_tests enable row level security;
alter table public.mock_test_questions enable row level security;
alter table public.quiz_attempts enable row level security;

-- Remove policies from the earlier additive draft if that draft was applied.
drop policy if exists "Allow read questions for all authenticated or anon" on public.questions;
drop policy if exists "Allow read question_options for all" on public.question_options;
drop policy if exists "Allow read pyqs for all" on public.pyqs;
drop policy if exists "Allow read predicted_questions for all" on public.predicted_questions;
drop policy if exists "Allow read quizzes for all" on public.quizzes;
drop policy if exists "Allow read quiz_questions for all" on public.quiz_questions;
drop policy if exists "Allow read mock_tests for all" on public.mock_tests;
drop policy if exists "Allow read mock_test_questions for all" on public.mock_test_questions;
drop policy if exists "Students can manage their own quiz attempts" on public.quiz_attempts;

drop policy if exists "Authenticated users can read available questions" on public.questions;
create policy "Authenticated users can read available questions"
  on public.questions for select to authenticated
  using (not is_premium or public.is_premium_user() or public.is_staff());

drop policy if exists "Authenticated users can read question options" on public.question_options;
create policy "Authenticated users can read question options"
  on public.question_options for select to authenticated
  using (
    exists (
      select 1 from public.questions q
      where q.id = question_id
        and (not q.is_premium or public.is_premium_user() or public.is_staff())
    )
  );

drop policy if exists "Authenticated users can read pyqs" on public.pyqs;
create policy "Authenticated users can read pyqs"
  on public.pyqs for select to authenticated
  using (true);

drop policy if exists "Authenticated users can read available predictions" on public.predicted_questions;
create policy "Authenticated users can read available predictions"
  on public.predicted_questions for select to authenticated
  using (not is_premium or public.is_premium_user() or public.is_staff());

drop policy if exists "Authenticated users can read available quizzes" on public.quizzes;
create policy "Authenticated users can read available quizzes"
  on public.quizzes for select to authenticated
  using (not is_premium or public.is_premium_user() or public.is_staff());

drop policy if exists "Authenticated users can read quiz questions" on public.quiz_questions;
create policy "Authenticated users can read quiz questions"
  on public.quiz_questions for select to authenticated
  using (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_id
        and (not q.is_premium or public.is_premium_user() or public.is_staff())
    )
  );

drop policy if exists "Authenticated users can read available mock tests" on public.mock_tests;
create policy "Authenticated users can read available mock tests"
  on public.mock_tests for select to authenticated
  using (not is_premium or public.is_premium_user() or public.is_staff());

drop policy if exists "Authenticated users can read mock test questions" on public.mock_test_questions;
create policy "Authenticated users can read mock test questions"
  on public.mock_test_questions for select to authenticated
  using (
    exists (
      select 1 from public.mock_tests m
      where m.id = mock_test_id
        and (not m.is_premium or public.is_premium_user() or public.is_staff())
    )
  );

drop policy if exists "Students can read their quiz attempts" on public.quiz_attempts;
create policy "Students can read their quiz attempts"
  on public.quiz_attempts for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Students can create their quiz attempts" on public.quiz_attempts;
create policy "Students can create their quiz attempts"
  on public.quiz_attempts for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Students can update their quiz attempts" on public.quiz_attempts;
create policy "Students can update their quiz attempts"
  on public.quiz_attempts for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Content authoring stays staff-only.
drop policy if exists "Staff can create questions" on public.questions;
create policy "Staff can create questions" on public.questions
  for insert to authenticated with check (public.is_staff());
drop policy if exists "Staff can update questions" on public.questions;
create policy "Staff can update questions" on public.questions
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

-- -----------------------------------------------------------------------------
-- Indexes used by the current frontend queries
-- -----------------------------------------------------------------------------

create index if not exists questions_subject_idx on public.questions(subject_id);
create index if not exists questions_chapter_idx on public.questions(chapter_id);
create index if not exists questions_filters_idx on public.questions(question_type, difficulty, priority);
create index if not exists questions_flags_idx on public.questions(is_pyq, is_predicted, is_premium);
create index if not exists content_items_chapter_status_idx on public.content_items(chapter_id, status);
create index if not exists student_progress_user_subject_idx on public.student_progress(user_id, subject_id);
create index if not exists quiz_questions_order_idx on public.quiz_questions(quiz_id, order_index);
create index if not exists mock_test_questions_order_idx on public.mock_test_questions(mock_test_id, order_index);
create index if not exists quiz_attempts_user_created_idx on public.quiz_attempts(user_id, created_at desc);
