-- =====================================================
-- COMPLETE SUPABASE DATABASE SETUP
-- Nashik Connect Lingo - Kumbh Vyapaar AI
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- CLEANUP: Drop existing objects
-- =====================================================

-- Drop views
DROP VIEW IF EXISTS store_dashboard CASCADE;
DROP VIEW IF EXISTS available_guides CASCADE;
DROP VIEW IF EXISTS guide_booking_stats CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_store_stats() CASCADE;
DROP FUNCTION IF EXISTS update_cart_totals() CASCADE;
DROP FUNCTION IF EXISTS update_guide_stats() CASCADE;
DROP FUNCTION IF EXISTS get_available_guides(DATE) CASCADE;

-- Drop sequences
DROP SEQUENCE IF EXISTS order_number_seq CASCADE;

-- Drop tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS guide_bookings CASCADE;
DROP TABLE IF EXISTS student_guides CASCADE;

-- =====================================================
-- PART 1: MERCHANT HUB TABLES
-- =====================================================

-- STORES TABLE
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    address TEXT NOT NULL,
    landmark TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    store_image_url TEXT,
    banner_image_url TEXT,
    opening_hours VARCHAR(100),
    is_open BOOLEAN DEFAULT true,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    gst_number VARCHAR(50),
    pan_number VARCHAR(20),
    business_type VARCHAR(50),
    total_products INTEGER DEFAULT 0,
    total_sales DECIMAL(12, 2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id)
);

-- PRODUCTS TABLE
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    serial_number VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10, 2),
    discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    min_order_quantity INTEGER DEFAULT 1,
    max_order_quantity INTEGER,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    tags TEXT[],
    image_url TEXT,
    additional_images TEXT[],
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    weight DECIMAL(10, 2),
    dimensions VARCHAR(100),
    material VARCHAR(100),
    color VARCHAR(50),
    size VARCHAR(50),
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CARTS TABLE
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    total_items INTEGER DEFAULT 0,
    subtotal DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days'
);

-- CART ITEMS TABLE
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, product_id)
);

-- ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_landmark TEXT,
    delivery_city VARCHAR(100),
    delivery_pincode VARCHAR(20),
    delivery_latitude DECIMAL(10, 8),
    delivery_longitude DECIMAL(11, 8),
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),
    order_status VARCHAR(50) DEFAULT 'pending',
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    tracking_number VARCHAR(100),
    customer_notes TEXT,
    admin_notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- ORDER ITEMS TABLE
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_image_url TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PART 2: PILGRIM GUIDE TABLES
-- =====================================================

-- STUDENT GUIDES TABLE
CREATE TABLE student_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 30),
    gender VARCHAR(20),
    college_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(100) UNIQUE NOT NULL,
    course VARCHAR(255),
    year_of_study INTEGER,
    languages_spoken TEXT[] NOT NULL DEFAULT '{}',
    specialization TEXT[] NOT NULL DEFAULT '{}',
    daily_rate DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    available_days TEXT[] DEFAULT '{}',
    student_id_card_url TEXT,
    photo_url TEXT,
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id)
);

-- GUIDE BOOKINGS TABLE
CREATE TABLE guide_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES student_guides(id) ON DELETE CASCADE,
    visitor_name VARCHAR(255) NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    number_of_people INTEGER DEFAULT 1,
    tour_type VARCHAR(100),
    special_requests TEXT,
    preferred_language VARCHAR(50),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    booking_status VARCHAR(50) DEFAULT 'pending',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT
);

-- =====================================================
-- PART 3: INDEXES
-- =====================================================

-- Stores Indexes
CREATE INDEX idx_stores_user_id ON stores(user_id);
CREATE INDEX idx_stores_category ON stores(category);
CREATE INDEX idx_stores_is_active ON stores(is_active);
CREATE INDEX idx_stores_created_at ON stores(created_at DESC);

-- Products Indexes
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Carts Indexes
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);

-- Cart Items Indexes
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- Orders Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Order Items Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_store_id ON order_items(store_id);

-- Student Guides Indexes
CREATE INDEX idx_student_guides_verified ON student_guides(is_verified);
CREATE INDEX idx_student_guides_active ON student_guides(is_active);
CREATE INDEX idx_student_guides_email ON student_guides(email);

-- Guide Bookings Indexes
CREATE INDEX idx_guide_bookings_guide_id ON guide_bookings(guide_id);
CREATE INDEX idx_guide_bookings_date ON guide_bookings(booking_date);
CREATE INDEX idx_guide_bookings_status ON guide_bookings(booking_status);

-- =====================================================
-- PART 4: SEQUENCES & FUNCTIONS
-- =====================================================

-- Create sequence for order numbers
CREATE SEQUENCE order_number_seq START 1;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update store statistics
CREATE OR REPLACE FUNCTION update_store_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE stores SET total_products = (
            SELECT COUNT(*) FROM products WHERE store_id = OLD.store_id AND is_active = true
        ) WHERE id = OLD.store_id;
        RETURN OLD;
    ELSE
        UPDATE stores SET total_products = (
            SELECT COUNT(*) FROM products WHERE store_id = NEW.store_id AND is_active = true
        ) WHERE id = NEW.store_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update cart totals
CREATE OR REPLACE FUNCTION update_cart_totals()
RETURNS TRIGGER AS $$
DECLARE
    v_cart_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_cart_id := OLD.cart_id;
    ELSE
        v_cart_id := NEW.cart_id;
    END IF;
    
    UPDATE carts SET 
        total_items = (SELECT COUNT(*) FROM cart_items WHERE cart_id = v_cart_id),
        subtotal = (SELECT COALESCE(SUM(subtotal), 0) FROM cart_items WHERE cart_id = v_cart_id)
    WHERE id = v_cart_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update guide statistics
CREATE OR REPLACE FUNCTION update_guide_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_status = 'completed' AND (OLD IS NULL OR OLD.booking_status != 'completed') THEN
        UPDATE student_guides SET 
            total_bookings = total_bookings + 1,
            average_rating = (
                SELECT AVG(rating)::DECIMAL(3,2) FROM guide_bookings
                WHERE guide_id = NEW.guide_id AND rating IS NOT NULL AND booking_status = 'completed'
            )
        WHERE id = NEW.guide_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 5: TRIGGERS
-- =====================================================

-- Update timestamp triggers
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_guides_updated_at BEFORE UPDATE ON student_guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guide_bookings_updated_at BEFORE UPDATE ON guide_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Business logic triggers
CREATE TRIGGER update_store_stats_trigger AFTER INSERT OR UPDATE OR DELETE ON products FOR EACH ROW EXECUTE FUNCTION update_store_stats();
CREATE TRIGGER update_cart_totals_trigger AFTER INSERT OR UPDATE OR DELETE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_cart_totals();
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();
CREATE TRIGGER update_guide_stats_trigger AFTER UPDATE ON guide_bookings FOR EACH ROW EXECUTE FUNCTION update_guide_stats();

-- =====================================================
-- PART 6: ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_bookings ENABLE ROW LEVEL SECURITY;

-- Stores Policies
CREATE POLICY "Public can view active stores" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create own store" ON stores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own store" ON stores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own store" ON stores FOR DELETE USING (auth.uid() = user_id);

-- Products Policies
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create products" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products" ON products FOR DELETE USING (auth.uid() = user_id);

-- Carts Policies
CREATE POLICY "Users can view own cart" ON carts FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Anyone can create cart" ON carts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own cart" ON carts FOR UPDATE USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- Cart Items Policies
CREATE POLICY "Users can view cart items" ON cart_items FOR SELECT USING (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)));
CREATE POLICY "Anyone can add cart items" ON cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update cart items" ON cart_items FOR UPDATE USING (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)));
CREATE POLICY "Users can delete cart items" ON cart_items FOR DELETE USING (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)));

-- Orders Policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM order_items oi JOIN stores s ON oi.store_id = s.id WHERE oi.order_id = orders.id AND s.user_id = auth.uid()));
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Store owners can update orders" ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM order_items oi JOIN stores s ON oi.store_id = s.id WHERE oi.order_id = orders.id AND s.user_id = auth.uid()));

-- Order Items Policies
CREATE POLICY "Users can view order items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR EXISTS (SELECT 1 FROM stores s WHERE s.id = order_items.store_id AND s.user_id = auth.uid()))));
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);

-- Student Guides Policies
CREATE POLICY "Public can view verified guides" ON student_guides FOR SELECT USING (is_verified = true AND is_active = true);
CREATE POLICY "Anyone can enroll as guide" ON student_guides FOR INSERT WITH CHECK (true);
CREATE POLICY "Guides can update own profile" ON student_guides FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Guide Bookings Policies
CREATE POLICY "Users can view bookings" ON guide_bookings FOR SELECT USING (visitor_email = current_setting('request.jwt.claims', true)::json->>'email' OR EXISTS (SELECT 1 FROM student_guides WHERE id = guide_bookings.guide_id AND email = current_setting('request.jwt.claims', true)::json->>'email'));
CREATE POLICY "Anyone can create bookings" ON guide_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update bookings" ON guide_bookings FOR UPDATE USING (visitor_email = current_setting('request.jwt.claims', true)::json->>'email' OR EXISTS (SELECT 1 FROM student_guides WHERE id = guide_bookings.guide_id AND email = current_setting('request.jwt.claims', true)::json->>'email'));

-- =====================================================
-- PART 7: GRANT PERMISSIONS
-- =====================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON stores TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON carts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;
GRANT SELECT, INSERT ON order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE ON student_guides TO authenticated;
GRANT SELECT, INSERT, UPDATE ON guide_bookings TO authenticated;

GRANT SELECT ON stores TO anon;
GRANT SELECT ON products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON carts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO anon;
GRANT INSERT ON orders TO anon;
GRANT INSERT ON order_items TO anon;
GRANT SELECT, INSERT ON student_guides TO anon;
GRANT INSERT ON guide_bookings TO anon;

GRANT USAGE ON SEQUENCE order_number_seq TO authenticated, anon;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- Verify tables created
SELECT 
    'Tables Created' as status,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('stores', 'products', 'carts', 'cart_items', 'orders', 'order_items', 'student_guides', 'guide_bookings');
