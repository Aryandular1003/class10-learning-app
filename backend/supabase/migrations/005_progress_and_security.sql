-- Product engineering hardening: safe profile writes, staff chapter writes,
-- and metadata storage for future progress synchronization.

alter table public.student_progress
  add column if not exists metadata jsonb not null default '{}'::jsonb;

drop policy if exists "Users can update their profile" on public.profiles;
drop policy if exists "Users can update safe profile fields" on public.profiles;
revoke update on public.profiles from authenticated;
grant update (display_name, full_name, class_level, board, preferred_language, state, city, school_name, study_goal, onboarding_completed) on public.profiles to authenticated;
create policy "Users can update safe profile fields" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Staff can create chapters" on public.chapters;
create policy "Staff can create chapters" on public.chapters
  for insert to authenticated with check (public.is_staff());
drop policy if exists "Staff can update chapters" on public.chapters;
create policy "Staff can update chapters" on public.chapters
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
