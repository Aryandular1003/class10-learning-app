-- BoardReady / RBSE Class 10
-- Migration 008: Payments and Orders tracking for Razorpay integration
-- Run after 001 through 007 migrations in the Supabase SQL editor.

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,
  razorpay_signature text,
  amount integer not null default 9900 check (amount > 0), -- amount in paise (9900 = Rs 99)
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created', 'captured', 'failed', 'refunded')),
  package_name text not null default 'Class 10 RBSE Board Prep',
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.payments enable row level security;

-- Policies:
-- 1. Students can view only their own payment records.
drop policy if exists "Students can read their own payments" on public.payments;
create policy "Students can read their own payments"
  on public.payments for select
  to authenticated
  using (user_id = (select auth.uid()));

-- 2. Prevent client-side insertion or modification of payments.
-- Only the backend service-role (or trusted Edge Functions) can insert or update payments.
drop policy if exists "Staff can view all payments" on public.payments;
create policy "Staff can view all payments"
  on public.payments for select
  to authenticated
  using (public.is_staff());

-- Add index on user_id and order_id for fast lookup
create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_order_id_idx on public.payments(razorpay_order_id);
create index if not exists payments_payment_id_idx on public.payments(razorpay_payment_id);
create index if not exists payments_status_idx on public.payments(status);

-- Automatic updated_at trigger
drop trigger if exists payments_touch_updated_at on public.payments;
create trigger payments_touch_updated_at before update on public.payments
for each row execute function public.touch_updated_at();
