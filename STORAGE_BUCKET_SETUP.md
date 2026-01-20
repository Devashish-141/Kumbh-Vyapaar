# Quick Fix: Creating Storage Bucket in Supabase

## Option 1: Manual Creation (Easiest)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click "New bucket" button

3. **Create the bucket**
   - **Name**: `product-images`
   - **Public bucket**: Toggle ON (enable)
   - Click "Create bucket"

4. **Set up policies** (Optional but recommended)
   - Click on the `product-images` bucket
   - Go to "Policies" tab
   - Click "New policy"
   - Use these settings:
     - **SELECT (Read)**: Enable for public
     - **INSERT (Upload)**: Enable for authenticated users only
     - **UPDATE/DELETE**: Enable for authenticated users (own files only)

## Option 2: Using SQL Editor

If you prefer SQL, run this in your Supabase SQL Editor:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Allow public to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## ✅ Current Workaround (Already Implemented)

**Good news!** The app now works WITHOUT the storage bucket:

- **File Upload**: Converts images to base64 and stores them in the database
- **URL Input**: You can paste image URLs or use emojis (🎁📦🧣)
- **No errors**: The app gracefully handles missing storage

### How to add products now:

1. **Login** to merchant account
2. Click **"Add New"** product
3. For the image, you can:
   - **Upload a file** (will use base64 if no bucket)
   - Click **"Use Image URL or Emoji"** button
   - Paste a URL like: `https://example.com/image.jpg`
   - Or use an emoji like: 🎁 📦 🧣 👕 💍
4. Fill other details and submit

The product will be added successfully!

## 📝 Note

- Base64 images work but are larger in database
- For production, it's better to create the storage bucket
- The app will automatically use storage if available
- Otherwise, it falls back to base64 seamlessly
