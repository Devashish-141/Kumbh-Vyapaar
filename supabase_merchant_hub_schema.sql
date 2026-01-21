-- =====================================================
-- COMPLETE MERCHANT HUB SQL SCHEMA FOR SUPABASE
-- Nashik Connect Lingo - Kumbh Vyapaar AI
-- =====================================================

-- Drop existing functions first
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_store_stats() CASCADE;
DROP FUNCTION IF EXISTS update_cart_totals() CASCADE;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS stores CASCADE;

-- Drop existing sequence
DROP SEQUENCE IF EXISTS order_number_seq CASCADE;

-- =====================================================
-- STORES TABLE
-- =====================================================
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Store Information
    store_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'Clothing', 'Jewelry', 'Food', 'Religious Items', 'Handicrafts'
    
    -- Location Information
    address TEXT NOT NULL,
    landmark TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Contact Information
    phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp VARCHAR(20),
    
    -- Store Details
    store_image_url TEXT,
    banner_image_url TEXT,
    opening_hours VARCHAR(100), -- e.g., "9:00 AM - 9:00 PM"
    is_open BOOLEAN DEFAULT true,
    
    -- User Association
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Business Information
    gst_number VARCHAR(50),
    pan_number VARCHAR(20),
    business_type VARCHAR(50), -- 'Individual', 'Partnership', 'Company'
    
    -- Statistics
    total_products INTEGER DEFAULT 0,
    total_sales DECIMAL(12, 2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Product Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    serial_number VARCHAR(100),
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10, 2),
    discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    min_order_quantity INTEGER DEFAULT 1,
    max_order_quantity INTEGER,
    
    -- Categorization
    category VARCHAR(100),
    subcategory VARCHAR(100),
    tags TEXT[], -- Array of tags for search
    
    -- Media
    image_url TEXT,
    additional_images TEXT[], -- Array of additional image URLs
    
    -- Store Association
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Product Details
    weight DECIMAL(10, 2), -- in kg
    dimensions VARCHAR(100), -- e.g., "10x20x5 cm"
    material VARCHAR(100),
    color VARCHAR(50),
    size VARCHAR(50),
    
    -- SEO & Marketing
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    
    -- Statistics
    views_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CARTS TABLE
-- =====================================================
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Association (can be null for guest carts)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- For guest users
    
    -- Cart Details
    total_items INTEGER DEFAULT 0,
    subtotal DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days'
);

-- =====================================================
-- CART ITEMS TABLE
-- =====================================================
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Associations
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    
    -- Item Details
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique product per cart
    UNIQUE(cart_id, product_id)
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Customer Information
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- Delivery Information
    delivery_address TEXT NOT NULL,
    delivery_landmark TEXT,
    delivery_city VARCHAR(100),
    delivery_pincode VARCHAR(20),
    delivery_latitude DECIMAL(10, 8),
    delivery_longitude DECIMAL(11, 8),
    
    -- Order Details
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Payment Information
    payment_method VARCHAR(50), -- 'COD', 'UPI', 'Card', 'Wallet'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    payment_id VARCHAR(255),
    
    -- Order Status
    order_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
    
    -- Delivery Information
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    tracking_number VARCHAR(100),
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    cancellation_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Associations
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL NOT NULL,
    
    -- Product Snapshot (in case product is deleted)
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_image_url TEXT,
    
    -- Pricing
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Stores Indexes
CREATE INDEX idx_stores_user_id ON stores(user_id);
CREATE INDEX idx_stores_category ON stores(category);
CREATE INDEX idx_stores_is_active ON stores(is_active);
CREATE INDEX idx_stores_is_verified ON stores(is_verified);
CREATE INDEX idx_stores_location ON stores(latitude, longitude);
CREATE INDEX idx_stores_created_at ON stores(created_at DESC);

-- Products Indexes
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Carts Indexes
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
CREATE INDEX idx_carts_is_active ON carts(is_active);

-- Cart Items Indexes
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_cart_items_store_id ON cart_items(store_id);

-- Orders Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Order Items Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_store_id ON order_items(store_id);

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

-- Function to update store statistics
CREATE OR REPLACE FUNCTION update_store_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE stores
    SET 
        total_products = (
            SELECT COUNT(*) FROM products 
            WHERE store_id = NEW.store_id AND is_active = true
        )
    WHERE id = NEW.store_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update cart totals
CREATE OR REPLACE FUNCTION update_cart_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE carts
    SET 
        total_items = (SELECT COUNT(*) FROM cart_items WHERE cart_id = NEW.cart_id),
        subtotal = (SELECT COALESCE(SUM(subtotal), 0) FROM cart_items WHERE cart_id = NEW.cart_id)
    WHERE id = NEW.cart_id;
    RETURN NEW;
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

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp triggers
CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Store statistics trigger
CREATE TRIGGER update_store_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_store_stats();

-- Cart totals trigger
CREATE TRIGGER update_cart_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_cart_totals();

-- Order number generation trigger
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- STORES POLICIES

CREATE POLICY "Public can view active stores"
    ON stores FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated users can create own store"
    ON stores FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own store"
    ON stores FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own store"
    ON stores FOR DELETE
    USING (auth.uid() = user_id);

-- PRODUCTS POLICIES

CREATE POLICY "Public can view active products"
    ON products FOR SELECT
    USING (is_active = true);

CREATE POLICY "Users can create products for own store"
    ON products FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
    ON products FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
    ON products FOR DELETE
    USING (auth.uid() = user_id);

-- CARTS POLICIES

CREATE POLICY "Users can view own cart"
    ON carts FOR SELECT
    USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Anyone can create cart"
    ON carts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own cart"
    ON carts FOR UPDATE
    USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- CART ITEMS POLICIES

CREATE POLICY "Users can view own cart items"
    ON cart_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM carts 
            WHERE carts.id = cart_items.cart_id 
            AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
        )
    );

CREATE POLICY "Anyone can add cart items"
    ON cart_items FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own cart items"
    ON cart_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM carts 
            WHERE carts.id = cart_items.cart_id 
            AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
        )
    );

CREATE POLICY "Users can delete own cart items"
    ON cart_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM carts 
            WHERE carts.id = cart_items.cart_id 
            AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
        )
    );

-- ORDERS POLICIES

CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM order_items oi
            JOIN stores s ON oi.store_id = s.id
            WHERE oi.order_id = orders.id AND s.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create orders"
    ON orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Store owners can update orders"
    ON orders FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM order_items oi
            JOIN stores s ON oi.store_id = s.id
            WHERE oi.order_id = orders.id AND s.user_id = auth.uid()
        )
    );

-- ORDER ITEMS POLICIES

CREATE POLICY "Users can view order items"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE o.id = order_items.order_id 
            AND (
                o.user_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM stores s 
                    WHERE s.id = order_items.store_id AND s.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Anyone can create order items"
    ON order_items FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- SAMPLE DATA (FOR TESTING)
-- =====================================================

-- Note: You'll need to create auth users first before running this
-- For now, we'll skip sample data as it requires actual user IDs

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View for store dashboard
CREATE OR REPLACE VIEW store_dashboard AS
SELECT 
    s.id,
    s.store_name,
    s.total_products,
    s.total_sales,
    s.total_orders,
    s.average_rating,
    COUNT(DISTINCT p.id) as active_products,
    COUNT(DISTINCT o.id) as pending_orders
FROM stores s
LEFT JOIN products p ON s.id = p.store_id AND p.is_active = true
LEFT JOIN order_items oi ON s.id = oi.store_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.order_status IN ('pending', 'confirmed', 'processing')
GROUP BY s.id, s.store_name, s.total_products, s.total_sales, s.total_orders, s.average_rating;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON stores TO authenticated;
GRANT INSERT ON stores TO authenticated;
GRANT UPDATE ON stores TO authenticated;
GRANT DELETE ON stores TO authenticated;

GRANT SELECT ON products TO authenticated;
GRANT INSERT ON products TO authenticated;
GRANT UPDATE ON products TO authenticated;
GRANT DELETE ON products TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON carts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO authenticated;
GRANT SELECT, INSERT, UPDATE ON orders TO authenticated;
GRANT SELECT, INSERT ON order_items TO authenticated;

-- Grant to anonymous users for public viewing
GRANT SELECT ON stores TO anon;
GRANT SELECT ON products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON carts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON cart_items TO anon;
GRANT INSERT ON orders TO anon;
GRANT INSERT ON order_items TO anon;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE stores IS 'Merchant store profiles visible to customers';
COMMENT ON TABLE products IS 'Products listed by merchants in their stores';
COMMENT ON TABLE carts IS 'Shopping carts for users and guests';
COMMENT ON TABLE cart_items IS 'Items added to shopping carts';
COMMENT ON TABLE orders IS 'Customer orders placed on the platform';
COMMENT ON TABLE order_items IS 'Individual items within orders';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
