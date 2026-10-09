# BoardReady Backend

This folder contains the Supabase database foundation for BoardReady.

## Migrations

Run migrations `001` through `007` in order in the Supabase SQL editor:

1. `supabase/migrations/001_initial_schema.sql` — Creates base tables (`profiles`, `subjects`, `chapters`, `content_items`, `student_progress`), role enum, `is_staff()` function, and base RLS policies.
2. `supabase/migrations/002_auth_profile_trigger.sql` — Creates a trigger (`handle_new_user`) on `auth.users` to automatically provision a profile row on signup, plus backfill.
3. `supabase/migrations/003_profile_details.sql` — Adds learner onboarding fields (`class_level`, `board`, `preferred_language`, `state`, `city`, `school_name`, `study_goal`, `onboarding_completed`).
4. `supabase/migrations/004_profile_full_name.sql` — Adds `full_name` column to separate display name from real name.
5. `supabase/migrations/005_progress_and_security.sql` — Hardens profile update column permissions, grants staff chapter write policies, and adds progress metadata.
6. `supabase/migrations/006_updated_learning_schema.sql` — Adds `questions`, `question_options`, `pyqs`, `predicted_questions`, `quizzes`, `quiz_questions`, `mock_tests`, `mock_test_questions`, `quiz_attempts`, indexes, and premium access control.
7. `supabase/migrations/007_auth_hardening.sql` — Hardens profile RLS policies with `((select auth.uid()) = id)` and re-verifies column-level update grants.

## Critical Supabase Dashboard Settings

1. **Authentication → Sessions → Single session per user**: Must be **ENABLED**. This is the authoritative server-side guard enforcing one active session per account across devices.
2. **Authentication → Email → Confirm email**: Enable in production so students verify their email addresses.
3. **Authentication → Rate Limits**: Ensure adequate limits for production signup/sign-in volume.

## Payment & Premium Security

- Never grant `is_premium` from frontend code. Column-level permissions in migration 006 revoke updates to `is_premium` and `premium_since` from authenticated users.
- `profiles.is_premium` must only be set by a server-side verified payment flow (e.g. Supabase Edge Function or webhook service verifying Razorpay HMAC SHA256 signatures with `RAZORPAY_KEY_SECRET`).
