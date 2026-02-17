-- Blog posts table
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null, -- markdown
  category text not null,
  banner_image_url text,
  banner_image_storage_path text,
  inline_images jsonb default '[]'::jsonb,
  meta_title text,
  meta_description text,
  keywords text[] default '{}',
  read_min integer not null default 5,
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  publish_at timestamptz not null default now(),
  source text not null default 'curated' check (source in ('curated', 'generated')),
  generation_topic_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Blog topics for auto-generation (60 days)
create table if not exists public.blog_topics (
  id text primary key, -- e.g. 'day-01'
  day_number integer not null,
  title_hint text not null,
  topic text not null, -- detailed prompt for Claude
  category text not null,
  keywords text[] default '{}',
  image_prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'generated', 'failed')),
  generated_post_id uuid references public.blog_posts(id),
  scheduled_date date,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_blog_posts_status_publish on public.blog_posts (status, publish_at desc);
create index if not exists idx_blog_posts_slug on public.blog_posts (slug);
create index if not exists idx_blog_topics_status on public.blog_topics (status, scheduled_date);

-- RLS: public read for published posts, no public write
alter table public.blog_posts enable row level security;
alter table public.blog_topics enable row level security;

create policy "Public can read published blog posts"
  on public.blog_posts for select
  using (status = 'published' and publish_at <= now());

create policy "Service role full access to blog posts"
  on public.blog_posts for all
  using (true)
  with check (true);

create policy "Service role full access to blog topics"
  on public.blog_topics for all
  using (true)
  with check (true);
