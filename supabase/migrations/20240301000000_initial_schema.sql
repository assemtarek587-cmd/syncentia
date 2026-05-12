/*
# Initial SaaS Schema Setup
Creates the core tables for the Syncentia Affiliate & Content Platform.

## Query Description:
This migration establishes the foundational database structure, including tables for users, posts, products, categories, affiliate tracking, and newsletter subscribers. It also implements Row Level Security (RLS) to ensure data privacy and secure admin access.

## Metadata:
- Schema-Category: Structural
- Impact-Level: High
- Requires-Backup: false
- Reversible: true

## Structure Details:
- profiles, categories, posts, products, affiliate_links, affiliate_clicks, newsletter_subscribers, ads

## Security Implications:
- RLS Status: Enabled on all public tables
- Auth Requirements: Admin access required for writes. Public read access for published content.
*/

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create posts
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  affiliate_url TEXT,
  price TEXT,
  rating NUMERIC(3,1),
  features TEXT[] DEFAULT '{}',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create affiliate links
CREATE TABLE public.affiliate_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  destination_url TEXT NOT NULL,
  description TEXT,
  cta_label TEXT DEFAULT 'Visit Site',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create affiliate clicks (Tracking Intelligence)
CREATE TABLE public.affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_link_id UUID REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  device_type TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ads
CREATE TABLE public.ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  placement TEXT NOT NULL,
  slot_id TEXT,
  format TEXT DEFAULT 'auto',
  label TEXT DEFAULT 'Advertisement',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- Profiles: Users can read their own, Admins can read all
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- Categories: Public read, Admin write
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (public.is_admin());

-- Posts: Public read published, Admin write
CREATE POLICY "Public read published posts" ON public.posts FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admin write posts" ON public.posts FOR ALL USING (public.is_admin());

-- Products: Public read published, Admin write
CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (public.is_admin());

-- Affiliate Links: Public read active, Admin write
CREATE POLICY "Public read active affiliate links" ON public.affiliate_links FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write affiliate links" ON public.affiliate_links FOR ALL USING (public.is_admin());

-- Affiliate Clicks: Public insert, Admin read
CREATE POLICY "Public insert affiliate clicks" ON public.affiliate_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read affiliate clicks" ON public.affiliate_clicks FOR SELECT USING (public.is_admin());

-- Newsletter: Public insert, Admin read/write
CREATE POLICY "Public insert newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all newsletter" ON public.newsletter_subscribers FOR ALL USING (public.is_admin());

-- Ads: Public read active, Admin write
CREATE POLICY "Public read active ads" ON public.ads FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write ads" ON public.ads FOR ALL USING (public.is_admin());

-- Trigger for new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
