-- Outreach contacts
create table if not exists outreach_contacts (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text not null default '',
  company text not null default '',
  tags text[] default '{}',
  unsubscribed boolean default false not null,
  unsubscribed_at timestamptz,
  created_at timestamptz default now() not null
);

create index if not exists idx_outreach_contacts_email on outreach_contacts(email);
create index if not exists idx_outreach_contacts_unsubscribed on outreach_contacts(unsubscribed);

-- Outreach campaigns
create table if not exists outreach_campaigns (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  subject text not null,
  template_id text not null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'sending', 'sent', 'paused')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  tag_filter text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Outreach sends (one row per email sent)
create table if not exists outreach_sends (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references outreach_campaigns(id) on delete cascade not null,
  contact_id uuid references outreach_contacts(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'bounced')),
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  resend_id text,
  created_at timestamptz default now() not null,
  unique(campaign_id, contact_id)
);

create index if not exists idx_outreach_sends_campaign on outreach_sends(campaign_id);
create index if not exists idx_outreach_sends_contact on outreach_sends(contact_id);
create index if not exists idx_outreach_sends_status on outreach_sends(status);

-- No RLS on outreach tables — admin-only via service role client
