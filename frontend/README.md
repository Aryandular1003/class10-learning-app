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
| 008 | `008_payments_and_orders.sql` | Payments and orders audit trail with student-only read RLS |

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

The app implements a secure, server-verified payment workflow:

1. **Frontend (`src/lib/razorpay.js`):**
   - Calls the `create-razorpay-order` Supabase Edge Function to create an authenticated order.
   - Opens Razorpay modal with `order_id` and public `VITE_RAZORPAY_KEY_ID`.
   - On payment success, sends `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `verify-razorpay-payment`.
   - Upon cryptographic verification, refreshes the user profile and unlocks PRO across the app.
   - For offline testing or before Edge Functions deployment, a seamless test mode simulation is included.

2. **Backend Edge Functions (`backend/supabase/functions/`):**
   - `create-razorpay-order`: Authenticates user, creates Razorpay order for ₹199, records in `public.payments`.
   - `verify-razorpay-payment`: Cryptographically verifies HMAC-SHA256 signature, marks payment captured, and sets `profiles.is_premium = true` using service-role.
   - `razorpay-webhook`: Asynchronous webhook handler for Razorpay dashboard (`order.paid`, `payment.captured`).

3. **Deploying Edge Functions to Supabase:**
   ```bash
   # Set secrets in Supabase
   supabase secrets set RAZORPAY_KEY_ID=rzp_live_... RAZORPAY_KEY_SECRET=your_secret RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

   # Deploy functions
   supabase functions deploy create-razorpay-order
   supabase functions deploy verify-razorpay-payment
   supabase functions deploy razorpay-webhook
   ```

> ⚠️ Never put `RAZORPAY_KEY_SECRET` or server credentials in frontend code or Vite environment variables. Only the public `VITE_RAZORPAY_KEY_ID` belongs in `.env.local` / hosting dashboard.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # oxlint
npm run test     # vitest unit tests
npm run preview  # preview production build locally
```

Signed-in staff review items load from Supabase. Signed-in student chapter progress syncs to `student_progress` and is restored after local browser storage is cleared, while offline/demo mode remains local-only.
