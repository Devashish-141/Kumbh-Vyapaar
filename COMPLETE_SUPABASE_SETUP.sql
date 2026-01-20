-- ============================================
-- COMPLETE SUPABASE SETUP FOR NASHIK CONNECT
-- Products with Image Storage Support
-- ============================================

-- ============================================
-- PART 1: PRODUCTS TABLE
-- ============================================

-- Create products table with image support (URLs and base64)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Product Information
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    sold INTEGER DEFAULT 0 CHECK (sold >= 0),
    category TEXT,
    
    -- Image Storage (supports both URLs and base64)
    image_url TEXT, -- Can store: Supabase Storage URL, external URL, base64 data, or emoji
    
    -- User Association
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Metadata
    serial_no TEXT, -- Optional product serial number
    is_active BOOLEAN DEFAULT true
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- PART 2: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view all products
CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT
USING (true);

-- Policy: Authenticated users can insert their own products
CREATE POLICY "Authenticated users can insert own products"
ON public.products FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own products
CREATE POLICY "Users can update own products"
ON public.products FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own products
CREATE POLICY "Users can delete own products"
ON public.products FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- PART 3: STORAGE BUCKET FOR IMAGES
-- ============================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true, -- Public bucket
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- ============================================
-- PART 4: STORAGE POLICIES
-- ============================================

-- Policy: Anyone can view images (public read)
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own images
CREATE POLICY "Users can update own product images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own product images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- PART 5: HELPER FUNCTIONS (OPTIONAL)
-- ============================================

-- Function to get product count by user
CREATE OR REPLACE FUNCTION get_user_product_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.products WHERE user_id = user_uuid AND is_active = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get total sales by user
CREATE OR REPLACE FUNCTION get_user_total_sales(user_uuid UUID)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(price * sold), 0) 
        FROM public.products 
        WHERE user_id = user_uuid AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 6: SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Note: Replace 'YOUR_USER_ID_HERE' with an actual user ID from auth.users
-- You can get your user ID by running: SELECT id FROM auth.users LIMIT 1;

/*
INSERT INTO public.products (name, description, price, stock, sold, category, image_url, user_id)
VALUES 
    ('Tibetan Wool Shawl', 'Handwoven traditional Tibetan shawl with intricate patterns', 1200.00, 25, 45, 'Clothing', '🧣', 'YOUR_USER_ID_HERE'),
    ('Silver Nose Ring', 'Authentic silver nose ring from local artisans', 450.00, 50, 23, 'Jewelry', '💍', 'YOUR_USER_ID_HERE'),
    ('Handwoven Carpet', 'Beautiful handwoven carpet with traditional designs', 3500.00, 10, 8, 'Home Decor', '🏠', 'YOUR_USER_ID_HERE'),
    ('Brass Diya Set', 'Set of 5 traditional brass diyas for puja', 299.00, 100, 67, 'Religious Items', '🪔', 'YOUR_USER_ID_HERE'),
    ('Sandalwood Mala', 'Pure sandalwood prayer beads (108 beads)', 850.00, 30, 15, 'Religious Items', '📿', 'YOUR_USER_ID_HERE');
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if products table exists
-- SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products');

-- Check if storage bucket exists
-- SELECT * FROM storage.buckets WHERE id = 'product-images';

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'products';

-- Check storage policies
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- ============================================
-- NOTES
-- ============================================

/*
IMAGE STORAGE OPTIONS:

1. Supabase Storage URL:
   - Upload via app → stored in 'product-images' bucket
   - Example: https://[project].supabase.co/storage/v1/object/public/product-images/[user-id]/[filename]

2. External URL:
   - Direct link to image hosted elsewhere
   - Example: https://example.com/images/product.jpg

3. Base64 Data:
   - Image encoded as base64 string
   - Example: data:image/png;base64,iVBORw0KGgoAAAANS...
   - Works without storage bucket
   - Larger database size

4. Emoji:
   - Simple emoji representation
   - Example: 🎁 📦 🧣 👕 💍
   - Smallest storage footprint

The app automatically handles all formats!
*/
