create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image text,
  category_id uuid references public.categories(id) on delete set null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  affiliate_url text,
  price text,
  rating numeric,
  features text[] not null default '{}',
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  category_id uuid references public.categories(id) on delete set null,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  destination_url text not null,
  description text,
  cta_label text not null default 'Visit Site',
  category_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  slug text not null,
  referrer text,
  user_agent text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  clicked_at timestamptz not null default now()
);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  placement text not null check (placement in ('home-top', 'sidebar', 'in-article', 'footer')),
  slot_id text,
  format text not null default 'auto',
  label text not null default 'Advertisement',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ad_impressions (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid references public.ads(id) on delete set null,
  placement text not null,
  referrer text,
  user_agent text,
  viewed_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id and is_admin = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.products enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.ads enable row level security;
alter table public.ad_impressions enable row level security;

-- Public-only RLS policies (no auth.uid(), no profiles/is_admin-based permissions)

-- Categories: public SELECT all
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
on public.categories for select
using (true);

-- Posts: public SELECT only published
drop policy if exists "posts_public_read_published" on public.posts;
create policy "posts_public_read_published"
on public.posts for select
using (is_published = true);

-- Products: public SELECT only published
drop policy if exists "products_public_read_published" on public.products;
create policy "products_public_read_published"
on public.products for select
using (is_published = true);

-- Affiliate links: public SELECT only active
drop policy if exists "affiliate_links_public_read_active" on public.affiliate_links;
create policy "affiliate_links_public_read_active"
on public.affiliate_links for select
using (is_active = true);

-- Affiliate clicks: allow public INSERT for tracking
drop policy if exists "affiliate_clicks_public_insert" on public.affiliate_clicks;
create policy "affiliate_clicks_public_insert"
on public.affiliate_clicks for insert
with check (true);

-- Newsletter subscribers: allow public INSERT
drop policy if exists "newsletter_public_insert" on public.newsletter_subscribers;
create policy "newsletter_public_insert"
on public.newsletter_subscribers for insert
with check (true);

-- Ads: public SELECT only active
drop policy if exists "ads_public_read_active" on public.ads;
create policy "ads_public_read_active"
on public.ads for select
using (is_active = true);

-- Ad impressions: allow public INSERT
drop policy if exists "ad_impressions_public_insert" on public.ad_impressions;
create policy "ad_impressions_public_insert"
on public.ad_impressions for insert
with check (true);


drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
for each row execute procedure public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
for each row execute procedure public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute procedure public.set_updated_at();

drop trigger if exists newsletter_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_set_updated_at before update on public.newsletter_subscribers
for each row execute procedure public.set_updated_at();

drop trigger if exists affiliate_links_set_updated_at on public.affiliate_links;
create trigger affiliate_links_set_updated_at before update on public.affiliate_links
for each row execute procedure public.set_updated_at();

drop trigger if exists ads_set_updated_at on public.ads;
create trigger ads_set_updated_at before update on public.ads
for each row execute procedure public.set_updated_at();

insert into public.categories (name, slug, description)
values
  ('AI Tools', 'ai-tools', 'Artificial intelligence tools, assistants, and automation platforms.'),
  ('SaaS', 'saas', 'Software as a Service tools for teams and operators.'),
  ('Hosting', 'hosting', 'Web hosting, cloud platforms, and infrastructure providers.'),
  ('Student Tech', 'student-tech', 'Hardware and software for students and learners.'),
  ('Gaming Setup', 'gaming-setup', 'Gaming hardware, accessories, and setup recommendations.'),
  ('VPNs', 'vpns', 'Privacy, security, and streaming VPN services.')
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description;
