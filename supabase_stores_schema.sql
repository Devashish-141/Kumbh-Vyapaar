-- ============================================
-- STORE PROFILES TABLE
-- For merchant store information visible to pilgrims
-- ============================================

-- Create stores table
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Store Information
    store_name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- e.g., "Clothing", "Jewelry", "Food", "Religious Items"
    
    -- Location Information
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8), -- For map integration
    longitude DECIMAL(11, 8), -- For map integration
    landmark TEXT, -- Nearby landmark for easier navigation
    
    -- Contact Information
    phone TEXT,
    email TEXT,
    
    -- Store Details
    store_image_url TEXT, -- Store front image
    opening_hours TEXT, -- e.g., "9:00 AM - 9:00 PM"
    is_open BOOLEAN DEFAULT true,
    
    -- User Association
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false -- For future verification system
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON public.stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_category ON public.stores(category);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON public.stores(is_active);
CREATE INDEX IF NOT EXISTS idx_stores_location ON public.stores(latitude, longitude);

-- Add updated_at trigger
CREATE TRIGGER set_stores_updated_at
    BEFORE UPDATE ON public.stores
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active stores
CREATE POLICY "Anyone can view active stores"
ON public.stores FOR SELECT
USING (is_active = true);

-- Policy: Authenticated users can insert their own store
CREATE POLICY "Authenticated users can insert own store"
ON public.stores FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own store
CREATE POLICY "Users can update own store"
ON public.stores FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own store
CREATE POLICY "Users can delete own store"
ON public.stores FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- UPDATE PRODUCTS TABLE TO LINK WITH STORES
-- ============================================

-- Add store_id to products table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'store_id'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE;
        
        CREATE INDEX idx_products_store_id ON public.products(store_id);
    END IF;
END $$;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get store with product count
CREATE OR REPLACE FUNCTION get_store_with_products(store_uuid UUID)
RETURNS TABLE (
    store_id UUID,
    store_name TEXT,
    description TEXT,
    address TEXT,
    product_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.store_name,
        s.description,
        s.address,
        COUNT(p.id) as product_count
    FROM public.stores s
    LEFT JOIN public.products p ON s.id = p.store_id
    WHERE s.id = store_uuid AND s.is_active = true
    GROUP BY s.id, s.store_name, s.description, s.address;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all stores with their products
CREATE OR REPLACE FUNCTION get_all_stores_with_products()
RETURNS TABLE (
    store_id UUID,
    store_name TEXT,
    description TEXT,
    category TEXT,
    address TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    phone TEXT,
    store_image_url TEXT,
    opening_hours TEXT,
    is_open BOOLEAN,
    product_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.store_name,
        s.description,
        s.category,
        s.address,
        s.latitude,
        s.longitude,
        s.phone,
        s.store_image_url,
        s.opening_hours,
        s.is_open,
        COUNT(p.id) as product_count
    FROM public.stores s
    LEFT JOIN public.products p ON s.id = p.store_id AND p.is_active = true
    WHERE s.is_active = true
    GROUP BY s.id, s.store_name, s.description, s.category, s.address, 
             s.latitude, s.longitude, s.phone, s.store_image_url, 
             s.opening_hours, s.is_open
    ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if stores table exists
-- SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stores');

-- Check stores
-- SELECT * FROM public.stores;

-- Get all stores with product counts
-- SELECT * FROM get_all_stores_with_products();
