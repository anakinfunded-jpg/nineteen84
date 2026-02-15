-- Subscriptions table
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  plan_id text not null default 'free',
  status text not null default 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_subscriptions_user_id on subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_sub_id on subscriptions(stripe_subscription_id);

-- Usage tracking table
create table if not exists user_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  period text not null,
  words_used integer default 0 not null,
  images_used integer default 0 not null,
  unique(user_id, period)
);

create index if not exists idx_user_usage_user_period on user_usage(user_id, period);

-- RLS
alter table subscriptions enable row level security;
alter table user_usage enable row level security;

create policy "Users can view own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can view own usage"
  on user_usage for select
  using (auth.uid() = user_id);

-- Atomic increment functions (avoids race conditions)
create or replace function increment_words(p_user_id uuid, p_period text, p_count integer)
returns void as $$
begin
  insert into user_usage (user_id, period, words_used, images_used)
  values (p_user_id, p_period, p_count, 0)
  on conflict (user_id, period)
  do update set words_used = user_usage.words_used + p_count;
end;
$$ language plpgsql security definer;

create or replace function increment_images(p_user_id uuid, p_period text, p_count integer)
returns void as $$
begin
  insert into user_usage (user_id, period, words_used, images_used)
  values (p_user_id, p_period, 0, p_count)
  on conflict (user_id, period)
  do update set images_used = user_usage.images_used + p_count;
end;
$$ language plpgsql security definer;
