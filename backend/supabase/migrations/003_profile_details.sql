-- Adds the onboarding fields collected after email verification.

alter table public.profiles
  add column if not exists class_level integer not null default 10,
  add column if not exists board text not null default 'RBSE',
  add column if not exists preferred_language text not null default 'Hindi',
  add column if not exists state text not null default 'Rajasthan',
  add column if not exists city text,
  add column if not exists school_name text,
  add column if not exists study_goal text not null default 'Improve my board exam score',
  add column if not exists onboarding_completed boolean not null default false;
