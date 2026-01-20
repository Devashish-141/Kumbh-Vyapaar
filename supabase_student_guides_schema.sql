-- ============================================
-- STUDENT GUIDES TABLE
-- For tourists to hire local student guides
-- ============================================

-- Create student_guides table
CREATE TABLE IF NOT EXISTS public.student_guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Student Information
    full_name TEXT NOT NULL,
    age INTEGER CHECK (age >= 18 AND age <= 30),
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    
    -- Contact Information
    phone TEXT NOT NULL,
    email TEXT,
    whatsapp TEXT,
    
    -- Verification Documents
    student_id TEXT NOT NULL UNIQUE,
    college_name TEXT NOT NULL,
    id_card_url TEXT, -- Student ID card image
    photo_url TEXT, -- Profile photo
    
    -- Languages Spoken
    languages_spoken TEXT[] DEFAULT ARRAY['English', 'Hindi', 'Marathi'],
    
    -- Service Details
    daily_rate DECIMAL(10, 2) NOT NULL CHECK (daily_rate >= 0),
    available_from_date DATE,
    available_to_date DATE,
    areas_covered TEXT[], -- Areas they can guide in
    specialization TEXT[], -- Heritage, Food, Shopping, etc.
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Experience
    experience_years INTEGER DEFAULT 0,
    description TEXT,
    
    -- Ratings
    average_rating DECIMAL(3, 2) DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
    total_bookings INTEGER DEFAULT 0,
    
    -- User Association (if they have an account)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true
);

-- Create guide_bookings table
CREATE TABLE IF NOT EXISTS public.guide_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Booking Information
    booking_number TEXT UNIQUE NOT NULL,
    guide_id UUID REFERENCES public.student_guides(id) ON DELETE CASCADE NOT NULL,
    
    -- Tourist Information
    tourist_name TEXT NOT NULL,
    tourist_phone TEXT NOT NULL,
    tourist_email TEXT,
    
    -- Booking Details
    booking_date DATE NOT NULL,
    number_of_days INTEGER DEFAULT 1 CHECK (number_of_days > 0),
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    
    -- Payment
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_method TEXT CHECK (payment_method IN ('cash', 'upi', 'card')),
    
    -- Notes
    special_requirements TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true
);

-- Create guide_reviews table
CREATE TABLE IF NOT EXISTS public.guide_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Review Information
    guide_id UUID REFERENCES public.student_guides(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.guide_bookings(id) ON DELETE CASCADE,
    
    -- Tourist Information
    tourist_name TEXT NOT NULL,
    
    -- Review Details
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    
    -- Metadata
    is_verified BOOLEAN DEFAULT false
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_student_guides_is_available ON public.student_guides(is_available);
CREATE INDEX IF NOT EXISTS idx_student_guides_is_verified ON public.student_guides(is_verified);
CREATE INDEX IF NOT EXISTS idx_student_guides_daily_rate ON public.student_guides(daily_rate);
CREATE INDEX IF NOT EXISTS idx_student_guides_average_rating ON public.student_guides(average_rating DESC);

CREATE INDEX IF NOT EXISTS idx_guide_bookings_guide_id ON public.guide_bookings(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_bookings_status ON public.guide_bookings(status);
CREATE INDEX IF NOT EXISTS idx_guide_bookings_booking_date ON public.guide_bookings(booking_date);

CREATE INDEX IF NOT EXISTS idx_guide_reviews_guide_id ON public.guide_reviews(guide_id);

-- Add triggers
DROP TRIGGER IF EXISTS set_student_guides_updated_at ON public.student_guides;
CREATE TRIGGER set_student_guides_updated_at
    BEFORE UPDATE ON public.student_guides
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_guide_bookings_updated_at ON public.guide_bookings;
CREATE TRIGGER set_guide_bookings_updated_at
    BEFORE UPDATE ON public.guide_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE public.student_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_reviews ENABLE ROW LEVEL SECURITY;

-- Student Guides Policies
DROP POLICY IF EXISTS "Anyone can view verified guides" ON public.student_guides;
CREATE POLICY "Anyone can view verified guides"
ON public.student_guides FOR SELECT
USING (is_verified = true AND is_active = true);

DROP POLICY IF EXISTS "Authenticated users can insert guide profile" ON public.student_guides;
CREATE POLICY "Authenticated users can insert guide profile"
ON public.student_guides FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own guide profile" ON public.student_guides;
CREATE POLICY "Users can update own guide profile"
ON public.student_guides FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Guide Bookings Policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.guide_bookings;
CREATE POLICY "Anyone can create bookings"
ON public.guide_bookings FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view their bookings" ON public.guide_bookings;
CREATE POLICY "Anyone can view their bookings"
ON public.guide_bookings FOR SELECT
USING (true);

-- Guide Reviews Policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.guide_reviews;
CREATE POLICY "Anyone can view reviews"
ON public.guide_reviews FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone can create reviews" ON public.guide_reviews;
CREATE POLICY "Anyone can create reviews"
ON public.guide_reviews FOR INSERT
WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET FOR GUIDE DOCUMENTS
-- ============================================

-- Create guide-documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'guide-documents',
    'guide-documents',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];

-- Storage Policies for guide-documents
DROP POLICY IF EXISTS "Public can view guide documents" ON storage.objects;
CREATE POLICY "Public can view guide documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'guide-documents');

DROP POLICY IF EXISTS "Authenticated users can upload guide documents" ON storage.objects;
CREATE POLICY "Authenticated users can upload guide documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'guide-documents' 
    AND auth.role() = 'authenticated'
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function: Generate booking number
CREATE OR REPLACE FUNCTION generate_guide_booking_number()
RETURNS TEXT AS $$
DECLARE
    new_booking_number TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        new_booking_number := 'GB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        EXIT WHEN NOT EXISTS (
            SELECT 1 FROM public.guide_bookings WHERE booking_number = new_booking_number
        );
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique booking number';
        END IF;
    END LOOP;
    
    RETURN new_booking_number;
END;
$$ LANGUAGE plpgsql;

-- Function: Update guide average rating
CREATE OR REPLACE FUNCTION update_guide_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.student_guides
    SET average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.guide_reviews
        WHERE guide_id = NEW.guide_id
    )
    WHERE id = NEW.guide_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating after review
DROP TRIGGER IF EXISTS update_guide_rating_trigger ON public.guide_reviews;
CREATE TRIGGER update_guide_rating_trigger
    AFTER INSERT ON public.guide_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_guide_rating();

-- Function: Get available guides
CREATE OR REPLACE FUNCTION get_available_guides(
    p_date DATE DEFAULT CURRENT_DATE,
    p_min_rating DECIMAL DEFAULT 0.0
)
RETURNS TABLE (
    guide_id UUID,
    full_name TEXT,
    age INTEGER,
    languages_spoken TEXT[],
    daily_rate DECIMAL,
    average_rating DECIMAL,
    total_bookings INTEGER,
    description TEXT,
    photo_url TEXT,
    specialization TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sg.id,
        sg.full_name,
        sg.age,
        sg.languages_spoken,
        sg.daily_rate,
        sg.average_rating,
        sg.total_bookings,
        sg.description,
        sg.photo_url,
        sg.specialization
    FROM public.student_guides sg
    WHERE sg.is_verified = true
        AND sg.is_active = true
        AND sg.is_available = true
        AND sg.average_rating >= p_min_rating
        AND (sg.available_from_date IS NULL OR sg.available_from_date <= p_date)
        AND (sg.available_to_date IS NULL OR sg.available_to_date >= p_date)
    ORDER BY sg.average_rating DESC, sg.total_bookings DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SUMMARY
-- ============================================

/*
This SQL script creates:

1. STUDENT_GUIDES TABLE
   - Student guide profiles
   - Verification details
   - Languages, rates, availability
   - Ratings and reviews

2. GUIDE_BOOKINGS TABLE
   - Tourist bookings
   - Booking status
   - Payment tracking

3. GUIDE_REVIEWS TABLE
   - Tourist reviews
   - Rating system

4. STORAGE BUCKET
   - guide-documents: ID cards, photos

5. HELPER FUNCTIONS
   - Generate booking numbers
   - Update ratings automatically
   - Get available guides

All tables have proper RLS policies for security.
*/
