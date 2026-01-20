-- Create a table for storing product details
create table public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Product information
  name text not null,
  description text,
  price decimal(10,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  sold integer not null default 0 check (sold >= 0),
  image_url text,
  category text,
  
  -- Link to the merchant (user) who owns this product
  -- Assumes you are using Supabase Auth
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Create policies

-- 1. Everyone can view products (Marketplace view)
create policy "Products are viewable by everyone" 
  on public.products for select 
  using ( true );

-- 2. Merchants can insert their own products
create policy "Users can insert their own products" 
  on public.products for insert 
  with check ( auth.uid() = user_id );

-- 3. Merchants can update their own products
create policy "Users can update their own products" 
  on public.products for update 
  using ( auth.uid() = user_id );

-- 4. Merchants can delete their own products
create policy "Users can delete their own products" 
  on public.products for delete 
  using ( auth.uid() = user_id );

-- Create a storage bucket for product images (optional but recommended)
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- Create a policy to allow public access to product images
-- create policy "Give public access to product images" 
--   on storage.objects for select 
--   using ( bucket_id = 'product-images' );

-- Create a policy to allow merchants to upload product images
-- create policy "Allow authenticated uploads" 
--   on storage.objects for insert 
--   with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
