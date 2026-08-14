-- Nivo initial schema (PRD §5).
-- Money is stored as whole rupees (integers); derived values are never stored.
-- Run this in the Supabase Dashboard > SQL Editor. It is idempotent.

begin;

create table if not exists public.months (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  month text not null check (month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  allowance integer not null default 0 check (allowance >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, month)
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  month_id uuid not null references public.months (id) on delete cascade,
  name text not null,
  allocated_amount integer not null default 0 check (allocated_amount >= 0),
  created_at timestamptz not null default now(),
  unique (month_id, name)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets (id) on delete cascade,
  name text not null,
  amount integer not null check (amount >= 0),
  category text not null check (
    category in (
      'Essentials',
      'Studies',
      'Shopping',
      'Food',
      'Entertainment',
      'Transport',
      'Subscriptions',
      'Other'
    )
  ),
  date date not null,
  created_at timestamptz not null default now()
);

create index if not exists months_user_id_idx on public.months (user_id);
create index if not exists budgets_month_id_idx on public.budgets (month_id);
create index if not exists expenses_budget_id_idx on public.expenses (budget_id);
create index if not exists expenses_budget_date_idx on public.expenses (budget_id, date);

-- Base privileges for the client roles. Row-level security (below) is what
-- restricts which rows each role can actually touch.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.months to anon, authenticated;
grant select, insert, update, delete on public.budgets to anon, authenticated;
grant select, insert, update, delete on public.expenses to anon, authenticated;

-- Row-level security: users may only touch their own data.

alter table public.months enable row level security;
alter table public.budgets enable row level security;
alter table public.expenses enable row level security;

drop policy if exists "Users manage their own months" on public.months;
create policy "Users manage their own months"
  on public.months for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users manage budgets of their months" on public.budgets;
create policy "Users manage budgets of their months"
  on public.budgets for all
  using (
    exists (
      select 1 from public.months m
      where m.id = budgets.month_id and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.months m
      where m.id = budgets.month_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "Users manage expenses of their budgets" on public.expenses;
create policy "Users manage expenses of their budgets"
  on public.expenses for all
  using (
    exists (
      select 1 from public.budgets b
      join public.months m on m.id = b.month_id
      where b.id = expenses.budget_id and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.budgets b
      join public.months m on m.id = b.month_id
      where b.id = expenses.budget_id and m.user_id = auth.uid()
    )
  );

commit;
