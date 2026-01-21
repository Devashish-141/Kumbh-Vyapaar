-- =====================================================
-- QUICK FIX: Add missing columns to products table
-- Run this if you already ran the old schema and getting errors
-- =====================================================

-- Add the sold column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sold INTEGER DEFAULT 0;

-- Add the stock column to products table  
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name IN ('sold', 'stock');

-- Success message
SELECT 'Columns added successfully! You can now add products.' as status;
