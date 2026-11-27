-- Nivo: incoming transactions schema (Money Received feature).
-- Stores money the user receives during the month.
-- type must be one of: 'income', 'repayment', 'transfer'
-- Only 'income' and 'repayment' types count toward available funds.
-- Run this in the Supabase Dashboard > SQL Editor. It is idempotent.

begin;

create table if not exists public.incoming_transactions (
  id          uuid        primary key default gen_random_uuid(),
  month_id    uuid        not null references public.months (id) on delete cascade,
  amount      integer     not null check (amount > 0),
  source      text        not null check (char_length(btrim(source)) between 1 and 120),
  type        text        not null check (type in ('income', 'repayment', 'transfer')),
  date        date        not null,
  description text check (description is null or char_length(description) <= 500),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists incoming_month_id_idx on public.incoming_transactions (month_id);
create index if not exists incoming_month_date_idx on public.incoming_transactions (month_id, date);

-- Base privileges for the client roles.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.incoming_transactions to anon, authenticated;

-- Row-level security: users may only touch transactions belonging to their own months.
alter table public.incoming_transactions enable row level security;

drop policy if exists "Users manage their own incoming transactions" on public.incoming_transactions;
create policy "Users manage their own incoming transactions"
  on public.incoming_transactions for all
  using (
    exists (
      select 1 from public.months m
      where m.id = incoming_transactions.month_id
        and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.months m
      where m.id = incoming_transactions.month_id
        and m.user_id = auth.uid()
    )
  );

commit;
