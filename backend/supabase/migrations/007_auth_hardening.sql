-- Auth/profile hardening for the client-side protected routes.
-- Safe to run after 001_initial_schema.sql and 002_auth_profile_trigger.sql.

alter table public.profiles enable row level security;

drop policy if exists "Users can view their profile" on public.profiles;
create policy "Users can view their profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update safe profile fields" on public.profiles;
create policy "Users can update safe profile fields"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke update on public.profiles from authenticated;
grant update (
  display_name, full_name, class_level, board, preferred_language,
  state, city, school_name, study_goal, onboarding_completed
) on public.profiles to authenticated;

-- Do not use user-editable raw_user_meta_data for authorization decisions.
-- The trigger only uses it as an initial display-name convenience.
