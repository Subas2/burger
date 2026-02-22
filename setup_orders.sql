-- 1. Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGINT PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'preparing',
    shipping_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    location JSONB NOT NULL DEFAULT '{}'::jsonb,
    applied_promo TEXT,
    discount NUMERIC DEFAULT 0,
    hidden BOOLEAN DEFAULT false
);

-- 2. Set up Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read orders (for public order tracking and admin)
CREATE POLICY "Allow public read access to orders" 
ON public.orders FOR SELECT 
USING (true);

-- Allow anyone to insert orders (for checkout)
CREATE POLICY "Allow anonymous insert to orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update orders (for admin to update order status)
CREATE POLICY "Allow anonymous update to orders" 
ON public.orders FOR UPDATE 
USING (true);

-- Allow anyone to delete orders
CREATE POLICY "Allow anonymous delete to orders"
ON public.orders FOR DELETE
USING (true);
