# 🚀 Complete Supabase Setup Guide

## 📋 What This Does

This SQL script sets up everything you need for the Nashik Connect application:

✅ **Products table** with image support  
✅ **Storage bucket** for image files  
✅ **Row Level Security** policies  
✅ **Helper functions** for analytics  
✅ **Support for 4 image types**: Storage URLs, External URLs, Base64, Emojis  

---

## 🎯 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"** button

### Step 2: Run the Complete Setup

1. Open the file: `COMPLETE_SUPABASE_SETUP.sql`
2. **Copy ALL the content** from the file
3. **Paste** it into the SQL Editor
4. Click **"Run"** button (or press `Ctrl+Enter`)

### Step 3: Verify Setup

Run these verification queries one by one:

```sql
-- 1. Check if products table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'products'
);
-- Should return: true

-- 2. Check if storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'product-images';
-- Should return: 1 row with bucket details

-- 3. Check products table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';
-- Should show all columns

-- 4. Check RLS policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'products';
-- Should show 4 policies (SELECT, INSERT, UPDATE, DELETE)
```

---

## 🎨 Image Storage Formats Supported

The `image_url` column can store **4 different formats**:

### 1️⃣ **Supabase Storage URL** (Recommended)
```
https://[project].supabase.co/storage/v1/object/public/product-images/[user-id]/[filename].jpg
```
- ✅ Best for production
- ✅ Smallest database size
- ✅ Fast loading
- ✅ CDN support

### 2️⃣ **External URL**
```
https://example.com/images/product.jpg
```
- ✅ Use existing images
- ✅ No upload needed
- ⚠️ Depends on external server

### 3️⃣ **Base64 Data**
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```
- ✅ Works without storage bucket
- ✅ Self-contained
- ⚠️ Larger database size
- ⚠️ Slower queries with many products

### 4️⃣ **Emoji**
```
🎁 📦 🧣 👕 💍 🛍️ 🪔 📿
```
- ✅ Smallest size
- ✅ Fast
- ✅ Fun and simple
- ⚠️ Not a real image

---

## 🔐 Security Features

### Row Level Security (RLS)

**Products Table:**
- ✅ **SELECT**: Anyone can view all products
- ✅ **INSERT**: Only authenticated users can add products
- ✅ **UPDATE**: Users can only update their own products
- ✅ **DELETE**: Users can only delete their own products

**Storage Bucket:**
- ✅ **SELECT**: Anyone can view images (public)
- ✅ **INSERT**: Only authenticated users can upload
- ✅ **UPDATE**: Users can only update their own images
- ✅ **DELETE**: Users can only delete their own images

---

## 📊 Database Schema

### Products Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp (auto-updated) |
| `name` | TEXT | Product name (required) |
| `description` | TEXT | Product description |
| `price` | DECIMAL(10,2) | Price in rupees (required, ≥0) |
| `stock` | INTEGER | Available quantity (≥0) |
| `sold` | INTEGER | Units sold (≥0) |
| `category` | TEXT | Product category |
| `image_url` | TEXT | Image (URL/base64/emoji) |
| `user_id` | UUID | Owner (foreign key to auth.users) |
| `serial_no` | TEXT | Optional serial number |
| `is_active` | BOOLEAN | Active status (default: true) |

---

## 🧪 Testing the Setup

### Add a Test Product

After running the SQL, you can add a test product:

```sql
-- First, get your user ID
SELECT id FROM auth.users LIMIT 1;

-- Then insert a test product (replace YOUR_USER_ID)
INSERT INTO public.products (name, description, price, stock, category, image_url, user_id)
VALUES (
    'Test Product',
    'This is a test product',
    99.99,
    10,
    'Test Category',
    '🎁',
    'YOUR_USER_ID_HERE'
);

-- Verify it was added
SELECT * FROM public.products;
```

---

## 🔧 Helper Functions

The script includes useful functions:

### Get Product Count
```sql
SELECT get_user_product_count('YOUR_USER_ID');
```

### Get Total Sales
```sql
SELECT get_user_total_sales('YOUR_USER_ID');
```

---

## ⚠️ Troubleshooting

### Issue: "relation already exists"
**Solution**: The table already exists. You can either:
- Skip the setup (already done)
- Drop and recreate: `DROP TABLE IF EXISTS public.products CASCADE;`

### Issue: "bucket already exists"
**Solution**: The bucket is already created. This is fine!

### Issue: "policy already exists"
**Solution**: Policies are already set up. This is fine!

### Issue: Can't upload images
**Check**:
1. Is the bucket created? `SELECT * FROM storage.buckets;`
2. Are policies set? Run verification queries above
3. Is user authenticated? Check browser console

---

## 📝 What Happens After Setup

Once you run this SQL:

1. ✅ Products table is created
2. ✅ Storage bucket is ready
3. ✅ Security policies are active
4. ✅ Users can add products with images
5. ✅ App will automatically:
   - Upload to storage (if available)
   - Fall back to base64 (if storage fails)
   - Accept URLs and emojis

---

## 🎯 Next Steps

1. ✅ Run the SQL script
2. ✅ Verify with the queries above
3. ✅ Login to your app
4. ✅ Try adding a product with:
   - An uploaded image
   - An emoji (🎁)
   - A URL
5. ✅ Check if it appears in the dashboard

---

## 💡 Pro Tips

- **For testing**: Use emojis (fastest, easiest)
- **For development**: Use base64 (no bucket needed)
- **For production**: Use Supabase Storage (best performance)

The app handles all formats automatically! 🚀
