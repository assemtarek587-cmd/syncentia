/*
# Analytics and Conversions Schema
Description: Adds tables for tracking conversions and enhanced analytics.

## Query Description:
Creates a conversions table linked to clicks and products/links. Safe operation.

## Metadata:
- Schema-Category: Data
- Impact-Level: Low
- Requires-Backup: false
- Reversible: true

## Structure Details:
- New table `conversions`
*/

CREATE TABLE IF NOT EXISTS public.conversions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  click_id uuid REFERENCES public.affiliate_clicks(id) ON DELETE SET NULL,
  affiliate_link_id uuid REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  amount numeric(10, 2) DEFAULT 0,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read conversions" ON public.conversions 
  FOR SELECT TO authenticated USING (is_admin());

CREATE POLICY "Public insert conversions" ON public.conversions 
  FOR INSERT TO public WITH CHECK (true);
