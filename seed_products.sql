-- Insert sample products into the products table
-- Note: 'user_id' is required. You must replace 'YOUR_USER_ID_HERE' with a valid User ID from your auth.users table.
-- If you want to insert these without a specific user owner for testing, you might need to temporarily relax the Not Null constraint on user_id or use a dummy ID if your foreign key constraints allow it (which they usually don't).
-- HOWEVER, for a quick test if RLS allows inserts from anyone (which we didn't set), or if you run this in the SQL Editor (which bypasses RLS), you can use a valid UUID.

-- Assuming you are running this in Supabase SQL Editor which is a superuser (bypass RLS):

-- 1. First, make sure you have a user or create a placeholder one if valid foreign keys are enforced strictly.
-- For the sake of this seed script, I will assume we can just insert these. 
-- PLEASE REPLACE '00000000-0000-0000-0000-000000000000' with a real user ID from your Authentication > Users section to make 'edit/delete' policies work for that user.

INSERT INTO public.products (name, description, price, stock, sold, image_url, category, user_id)
VALUES 
  ('Tibetan Wool Shawl', 'Warm and authentic wool shawl from the Himalayas.', 1200, 23, 45, '🧣', 'Clothing', '00000000-0000-0000-0000-000000000000'),
  ('Silver Nose Ring', 'Traditional Maharashtrian nose ring.', 850, 12, 89, '💍', 'Jewelry', '00000000-0000-0000-0000-000000000000'),
  ('Handwoven Carpet', 'Exquisite handwoven carpet with intricate designs.', 4500, 8, 12, '🪢', 'Home Decor', '00000000-0000-0000-0000-000000000000'),
  ('Nashik Grapes', 'Fresh, export-quality grapes from local vineyards.', 120, 100, 500, '🍇', 'Food', '00000000-0000-0000-0000-000000000000');
