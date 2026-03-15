-- ══════════════════════════════════════════════════════════════
-- NYC Appeal Writer — Supabase Schema
-- Run this in Supabase > SQL Editor
-- ══════════════════════════════════════════════════════════════

-- ── subscribers ───────────────────────────────────────────────
create table if not exists subscribers (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz default now(),
  email                 text unique not null,
  plan                  text not null default 'free',   -- free | paid | annual
  stripe_customer_id    text,
  stripe_subscription_id text,
  letter_count          int  not null default 0,
  last_letter_at        timestamptz
);

-- Index for fast email lookups
create index if not exists subscribers_email_idx on subscribers (email);

-- ── submissions ────────────────────────────────────────────────
create table if not exists submissions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  email           text not null,
  name            text,
  plate_number    text,
  ticket_number   text,
  violation_date  text,
  location        text,
  violation_type  text,
  fine_amount     numeric(8,2),
  defense_reason  text,
  extra_details   text,
  letter_text     text,
  plan            text default 'free',  -- free | paid | annual
  exhibit_count   int  default 0,
  pdf_downloaded  boolean default false,
  borough         text
);

-- Index for email-based lookups
create index if not exists submissions_email_idx on submissions (email);
create index if not exists submissions_created_idx on submissions (created_at desc);

-- ── Row Level Security ─────────────────────────────────────────
-- Disable RLS so the anon key can insert from the frontend.
-- For production, restrict to authenticated users or use service role key.
alter table subscribers disable row level security;
alter table submissions  disable row level security;

-- ══════════════════════════════════════════════════════════════
-- Optional: enable RLS with a policy (recommended for production)
-- ══════════════════════════════════════════════════════════════
-- alter table subscribers enable row level security;
-- create policy "Insert own subscriber" on subscribers
--   for insert with check (true);
-- create policy "Read own subscriber" on subscribers
--   for select using (email = current_user);
