create table if not exists public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null check (char_length(trim(author_name)) between 1 and 60),
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists article_comments_slug_created_idx
  on public.article_comments (article_slug, created_at desc);

alter table public.article_comments enable row level security;

drop policy if exists "Anyone can read article comments" on public.article_comments;
create policy "Anyone can read article comments"
on public.article_comments
for select
to anon, authenticated
using (
  exists (
    select 1 from public.articles
    where public.articles.slug = public.article_comments.article_slug
      and public.articles.published = true
  )
);

drop policy if exists "Signed-in users can comment on published articles" on public.article_comments;
create policy "Signed-in users can comment on published articles"
on public.article_comments
for insert
to authenticated
with check (
  user_id = auth.uid()
  and char_length(trim(author_name)) between 1 and 60
  and char_length(trim(body)) between 1 and 2000
  and exists (
    select 1 from public.articles
    where public.articles.slug = public.article_comments.article_slug
      and public.articles.published = true
  )
);