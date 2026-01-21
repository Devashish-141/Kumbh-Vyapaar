-- =====================================================
-- SUPABASE SQL SCHEMA FOR PILGRIM GUIDE (STUDENT GUIDES)
-- Nashik Connect Lingo - Kumbh Vyapaar AI
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS guide_bookings CASCADE;
DROP TABLE IF EXISTS student_guides CASCADE;

-- =====================================================
-- STUDENT GUIDES TABLE
-- =====================================================
CREATE TABLE student_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 30),
    gender VARCHAR(20),
    
    -- Educational Information
    college_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(100) UNIQUE NOT NULL,
    course VARCHAR(255),
    year_of_study INTEGER,
    
    -- Guide Information
    languages_spoken TEXT[] NOT NULL DEFAULT '{}',
    specialization TEXT[] NOT NULL DEFAULT '{}',
    daily_rate DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    
    -- Availability
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    available_days TEXT[] DEFAULT '{}', -- ['monday', 'tuesday', etc.]
    
    -- Documents & Verification
    student_id_card_url TEXT,
    photo_url TEXT,
    
    -- Additional Information
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- GUIDE BOOKINGS TABLE
-- =====================================================
CREATE TABLE guide_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Booking Information
    guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
    visitor_name VARCHAR(255) NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20) NOT NULL,
    
    -- Booking Details
    booking_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    number_of_people INTEGER DEFAULT 1,
    
    -- Tour Information
    tour_type VARCHAR(100), -- 'heritage', 'food', 'full-day', 'custom'
    special_requests TEXT,
    preferred_language VARCHAR(50),
    
    -- Payment & Status
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    booking_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
    
    -- Rating & Feedback
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Student Guides Indexes
CREATE INDEX idx_student_guides_verified ON student_guides(is_verified);
CREATE INDEX idx_student_guides_active ON student_guides(is_active);
CREATE INDEX idx_student_guides_email ON student_guides(email);
CREATE INDEX idx_student_guides_student_id ON student_guides(student_id);
CREATE INDEX idx_student_guides_created_at ON student_guides(created_at DESC);
CREATE INDEX idx_student_guides_rating ON student_guides(average_rating DESC);

-- Guide Bookings Indexes
CREATE INDEX idx_guide_bookings_guide_id ON guide_bookings(guide_id);
CREATE INDEX idx_guide_bookings_date ON guide_bookings(booking_date);
CREATE INDEX idx_guide_bookings_status ON guide_bookings(booking_status);
CREATE INDEX idx_guide_bookings_payment_status ON guide_bookings(payment_status);
CREATE INDEX idx_guide_bookings_visitor_email ON guide_bookings(visitor_email);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update guide statistics after booking completion
CREATE OR REPLACE FUNCTION update_guide_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_status = 'completed' AND OLD.booking_status != 'completed' THEN
        UPDATE student_guides
        SET 
            total_bookings = total_bookings + 1,
            average_rating = (
                SELECT AVG(rating)::DECIMAL(3,2)
                FROM guide_bookings
                WHERE guide_id = NEW.guide_id 
                AND rating IS NOT NULL
                AND booking_status = 'completed'
            )
        WHERE id = NEW.guide_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at on student_guides
CREATE TRIGGER update_student_guides_updated_at
    BEFORE UPDATE ON student_guides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on guide_bookings
CREATE TRIGGER update_guide_bookings_updated_at
    BEFORE UPDATE ON guide_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update guide stats when booking is completed
CREATE TRIGGER update_guide_stats_trigger
    AFTER UPDATE ON guide_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_guide_stats();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on tables
ALTER TABLE student_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_bookings ENABLE ROW LEVEL SECURITY;

-- Student Guides Policies

-- Allow public to view verified and active guides
CREATE POLICY "Public can view verified active guides"
    ON student_guides
    FOR SELECT
    USING (is_verified = true AND is_active = true);

-- Allow anyone to insert (for enrollment)
CREATE POLICY "Anyone can enroll as guide"
    ON student_guides
    FOR INSERT
    WITH CHECK (true);

-- Allow guides to update their own profile
CREATE POLICY "Guides can update own profile"
    ON student_guides
    FOR UPDATE
    USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow admins to update any guide (for verification)
CREATE POLICY "Admins can update any guide"
    ON student_guides
    FOR UPDATE
    USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'admin'
    );

-- Guide Bookings Policies

-- Allow public to view their own bookings
CREATE POLICY "Users can view own bookings"
    ON guide_bookings
    FOR SELECT
    USING (
        visitor_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR EXISTS (
            SELECT 1 FROM student_guides
            WHERE id = guide_bookings.guide_id
            AND email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Allow anyone to create bookings
CREATE POLICY "Anyone can create bookings"
    ON guide_bookings
    FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own bookings
CREATE POLICY "Users can update own bookings"
    ON guide_bookings
    FOR UPDATE
    USING (
        visitor_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR EXISTS (
            SELECT 1 FROM student_guides
            WHERE id = guide_bookings.guide_id
            AND email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- =====================================================
-- SAMPLE DATA (FOR TESTING)
-- =====================================================

-- Insert sample student guides
INSERT INTO student_guides (
    full_name, email, phone, age, gender,
    college_name, student_id, course, year_of_study,
    languages_spoken, specialization, daily_rate,
    is_verified, is_active, bio, experience_years
) VALUES
(
    'Rahul Deshmukh',
    'rahul.deshmukh@example.com',
    '+91-9876543210',
    21,
    'Male',
    'KTHM College',
    'N-2024-042',
    'Bachelor of Arts (History)',
    3,
    ARRAY['English', 'Hindi', 'Marathi'],
    ARRAY['History & Architecture of ancient Nashik temples', 'Trimbakeshwar Jyotirlinga', 'Panchavati heritage'],
    500.00,
    true,
    true,
    'Passionate history student with deep knowledge of Nashik''s ancient temples and architectural heritage. Specialized in explaining the significance of Jyotirlingas and Ramayana connections.',
    2
),
(
    'Priyanka Patil',
    'priyanka.patil@example.com',
    '+91-9876543211',
    20,
    'Female',
    'RYK College of Science',
    'N-2024-115',
    'Bachelor of Tourism Management',
    2,
    ARRAY['English', 'Hindi', 'Marathi', 'Gujarati'],
    ARRAY['Godavari Ghat traditions and cultural heritage', 'Kumbh Mela history', 'Religious ceremonies'],
    600.00,
    true,
    true,
    'Tourism management student with expertise in Godavari Ghat traditions and cultural practices. Fluent in 4 languages and experienced in guiding international tourists.',
    1
),
(
    'Aniket Shinde',
    'aniket.shinde@example.com',
    '+91-9876543212',
    22,
    'Male',
    'Sandip Foundation',
    'N-2024-089',
    'Bachelor of Hotel Management',
    4,
    ARRAY['English', 'Hindi', 'Marathi', 'Tamil'],
    ARRAY['Panchavati food trails and local market history', 'Nashik street food', 'Wine tourism'],
    450.00,
    true,
    true,
    'Hotel management student specializing in culinary tourism. Expert in Nashik''s famous food spots, local markets, and wine vineyards. Perfect for food enthusiasts!',
    1
);

-- Insert sample bookings
INSERT INTO guide_bookings (
    guide_id, visitor_name, visitor_email, visitor_phone,
    booking_date, start_time, end_time, number_of_people,
    tour_type, preferred_language, total_amount,
    payment_status, booking_status, rating, feedback
) VALUES
(
    (SELECT id FROM student_guides WHERE student_id = 'N-2024-042'),
    'Amit Kumar',
    'amit.kumar@example.com',
    '+91-9988776655',
    CURRENT_DATE + INTERVAL '3 days',
    '09:00:00',
    '17:00:00',
    4,
    'heritage',
    'Hindi',
    500.00,
    'paid',
    'confirmed',
    NULL,
    NULL
),
(
    (SELECT id FROM student_guides WHERE student_id = 'N-2024-115'),
    'Sarah Johnson',
    'sarah.j@example.com',
    '+1-555-0123',
    CURRENT_DATE - INTERVAL '5 days',
    '10:00:00',
    '16:00:00',
    2,
    'full-day',
    'English',
    600.00,
    'paid',
    'completed',
    5,
    'Excellent guide! Very knowledgeable about Godavari Ghat traditions. Highly recommended!'
);

-- =====================================================
-- VIEWS FOR EASY QUERYING
-- =====================================================

-- View for available guides with their stats
CREATE OR REPLACE VIEW available_guides AS
SELECT 
    id,
    full_name,
    college_name,
    age,
    languages_spoken,
    specialization,
    daily_rate,
    student_id,
    is_verified,
    total_bookings,
    average_rating,
    experience_years,
    bio,
    photo_url
FROM student_guides
WHERE is_verified = true AND is_active = true
ORDER BY average_rating DESC, total_bookings DESC;

-- View for guide booking statistics
CREATE OR REPLACE VIEW guide_booking_stats AS
SELECT 
    sg.id,
    sg.full_name,
    sg.student_id,
    COUNT(gb.id) as total_bookings,
    COUNT(CASE WHEN gb.booking_status = 'completed' THEN 1 END) as completed_bookings,
    COUNT(CASE WHEN gb.booking_status = 'pending' THEN 1 END) as pending_bookings,
    COUNT(CASE WHEN gb.booking_status = 'cancelled' THEN 1 END) as cancelled_bookings,
    AVG(CASE WHEN gb.rating IS NOT NULL THEN gb.rating END)::DECIMAL(3,2) as avg_rating,
    SUM(CASE WHEN gb.payment_status = 'paid' THEN gb.total_amount ELSE 0 END) as total_earnings
FROM student_guides sg
LEFT JOIN guide_bookings gb ON sg.id = gb.guide_id
GROUP BY sg.id, sg.full_name, sg.student_id;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get available guides for a specific date
CREATE OR REPLACE FUNCTION get_available_guides(booking_date DATE)
RETURNS TABLE (
    guide_id UUID,
    guide_name VARCHAR,
    daily_rate DECIMAL,
    languages TEXT[],
    specialization TEXT[],
    rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sg.id,
        sg.full_name,
        sg.daily_rate,
        sg.languages_spoken,
        sg.specialization,
        sg.average_rating
    FROM student_guides sg
    WHERE sg.is_verified = true 
    AND sg.is_active = true
    AND NOT EXISTS (
        SELECT 1 FROM guide_bookings gb
        WHERE gb.guide_id = sg.id
        AND gb.booking_date = booking_date
        AND gb.booking_status IN ('confirmed', 'pending')
    )
    ORDER BY sg.average_rating DESC, sg.total_bookings DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT ON student_guides TO authenticated;
GRANT INSERT ON student_guides TO authenticated;
GRANT UPDATE ON student_guides TO authenticated;

GRANT SELECT ON guide_bookings TO authenticated;
GRANT INSERT ON guide_bookings TO authenticated;
GRANT UPDATE ON guide_bookings TO authenticated;

GRANT SELECT ON available_guides TO authenticated;
GRANT SELECT ON guide_booking_stats TO authenticated;

-- Grant access to anonymous users (for public viewing)
GRANT SELECT ON student_guides TO anon;
GRANT INSERT ON student_guides TO anon;
GRANT INSERT ON guide_bookings TO anon;
GRANT SELECT ON available_guides TO anon;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE student_guides IS 'Stores information about student guides available for hire in Nashik';
COMMENT ON TABLE guide_bookings IS 'Stores booking information for student guide services';
COMMENT ON COLUMN student_guides.languages_spoken IS 'Array of languages the guide can speak';
COMMENT ON COLUMN student_guides.specialization IS 'Array of guide specializations (heritage, food, etc.)';
COMMENT ON COLUMN student_guides.is_verified IS 'Whether the guide has been verified by admin';
COMMENT ON COLUMN guide_bookings.tour_type IS 'Type of tour: heritage, food, full-day, or custom';
COMMENT ON COLUMN guide_bookings.booking_status IS 'Status: pending, confirmed, completed, or cancelled';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
