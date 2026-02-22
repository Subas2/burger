-- Step 1: Create the settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_image TEXT,
    contact_info JSONB DEFAULT '{
        "address": "123 Burger Lane, Foodie City, FC 45678",
        "phone": "+1 (555) 123-4567",
        "email": "hello@burgerbakery.com",
        "facebook": "https://facebook.com",
        "instagram": "https://instagram.com",
        "twitter": "https://twitter.com",
        "youtube": "https://youtube.com",
        "heroVideo": "",
        "saleEndDate": ""
    }'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert a default row if the table is empty
INSERT INTO public.settings (hero_image)
SELECT NULL
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- Step 3: Set up Row Level Security (RLS) to allow public read access
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the settings
CREATE POLICY "Allow public read access to settings" 
ON public.settings FOR SELECT 
USING (true);

-- Allow anyone to update the settings (since there is no auth yet, allow anon updates)
CREATE POLICY "Allow anonymous update to settings" 
ON public.settings FOR UPDATE 
USING (true);

-- Allow anonymous inserts (just in case they accidentally delete the row)
CREATE POLICY "Allow anonymous insert to settings" 
ON public.settings FOR INSERT 
WITH CHECK (true);
