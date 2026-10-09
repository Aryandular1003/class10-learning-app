-- Stores the name entered in the onboarding form separately from the email.

alter table public.profiles
  add column if not exists full_name text;

update public.profiles
set full_name = coalesce(full_name, display_name)
where full_name is null;
