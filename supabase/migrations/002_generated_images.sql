-- Generated images table
create table if not exists generated_images (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  prompt text not null,
  revised_prompt text not null default '',
  image_url text not null,
  storage_path text not null,
  size text not null default '1024x1024',
  style text not null default 'vivid',
  quality text not null default 'standard',
  created_at timestamptz default now() not null
);

create index if not exists idx_generated_images_user_id on generated_images(user_id);

-- RLS
alter table generated_images enable row level security;

create policy "Users can view own images"
  on generated_images for select
  using (auth.uid() = user_id);

create policy "Users can insert own images"
  on generated_images for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own images"
  on generated_images for delete
  using (auth.uid() = user_id);

-- Storage bucket (run this in SQL editor, or create via dashboard)
-- insert into storage.buckets (id, name, public) values ('generated-images', 'generated-images', true);
