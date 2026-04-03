
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  name_ar text NOT NULL,
  description text DEFAULT '',
  description_ar text DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  old_price integer DEFAULT NULL,
  category text NOT NULL DEFAULT 'accessories',
  brand text NOT NULL DEFAULT '',
  image text DEFAULT '',
  images text[] DEFAULT '{}',
  specs jsonb DEFAULT '{}',
  in_stock boolean NOT NULL DEFAULT true,
  stock_quantity integer NOT NULL DEFAULT 0,
  is_new boolean NOT NULL DEFAULT false,
  is_promo boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  reviews integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products" ON public.products
  FOR SELECT TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all products" ON public.products
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products" ON public.products
  FOR DELETE TO authenticated
  USING (true);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
