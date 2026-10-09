# BoardReady — RBSE Class 10

BoardReady is a React/Vite study app for Class 10 RBSE students across Hindi, English, Mathematics, Science, and Social Science.

## Run locally

```bash
npm install
npm run dev
```

The app works without a backend connection using local browser storage. This makes it possible to continue designing and testing before educational content and cloud credentials are ready.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the two values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

**Razorpay (optional for payments):**
```
VITE_RAZORPAY_KEY_ID=rzp_live_...
```

For production deployments (Vercel, Netlify, Cloudflare Pages), set the same variables as **environment variables in your hosting dashboard** — never commit `.env.local` to source control.

> ⚠️ Never place a Supabase `service_role` key, database password, or Razorpay secret key in frontend code or environment variables. The database schema uses Row Level Security and only the publishable (anon) key is safe for browser use.

## Backend setup

The backend files are in the separate sibling `backend` folder.

Run the following migrations **in order** in the Supabase SQL Editor:

| # | File | Purpose |
|---|------|---------|
| 001 | `001_initial_schema.sql` | Profiles, subjects, chapters, content items, student progress, RLS |
| 002 | `002_auth_profile_trigger.sql` | Auto-create profile row on signup |
| 003 | `003_profile_details.sql` | Onboarding profile fields |
| 004 | `004_profile_full_name.sql` | `full_name` column separate from `display_name` |
| 005 | `005_progress_and_security.sql` | Column-level grants, staff chapter writes |
| 006 | `006_updated_learning_schema.sql` | Questions, PYQs, quizzes, mock tests, quiz attempts, premium entitlements, RLS |
| 007 | `007_auth_hardening.sql` | Re-applied hardened profile RLS using `(select auth.uid())` |

## Supabase Dashboard settings required manually

| Setting | Value | Why |
|---------|-------|-----|
| **Authentication → Sessions → Single session per user** | ✅ Enabled | Server-side guard for one-device login. `signOut({ scope: 'others' })` in the frontend provides a best-effort client-side revocation, but this dashboard setting is authoritative. |
| **Authentication → Email → Confirm email** | ✅ Enabled | Ensures users verify before signing in. |
| **Authentication → Rate limits** | Configure per your expected traffic | Prevents abuse of signup/reset flows. |

## Hosting configuration

### Vercel

A `vercel.json` is included at the project root. If deploying the `frontend/` sub-folder, set the root directory to `frontend` in the Vercel project settings.

### Netlify

A `public/_redirects` file with `/* /index.html 200` is included — this handles SPA deep links for routes like `/notes/science-1`, `/quiz/math-3`, etc.

### Cloudflare Pages

Set the **Build output directory** to `dist` and enable the **SPA routing** option (or add a `_redirects` file — the same `public/_redirects` works on Cloudflare Pages too).

## Payments (Razorpay)

- Set `VITE_RAZORPAY_KEY_ID` to your publishable test key (`rzp_test_...`) for staging or live key (`rzp_live_...`) for production.
- **Never** put `RAZORPAY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, or any server-only credential in frontend code or Vite env variables.
- Payment signatures **must** be verified server-side (Supabase Edge Function or backend webhook). A webhook endpoint that verifies `razorpay_signature` and sets `profiles.is_premium = true` via service-role is still required before going live.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # oxlint
npm run test     # vitest unit tests
npm run preview  # preview production build locally
```

Signed-in staff review items load from Supabase. Signed-in student chapter progress syncs to `student_progress` and is restored after local browser storage is cleared, while offline/demo mode remains local-only.
