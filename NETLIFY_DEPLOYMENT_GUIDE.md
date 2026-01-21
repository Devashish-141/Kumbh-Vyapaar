# Netlify Deployment Guide - Kumbh Vyapaar AI

## 🚀 Quick Deployment Steps

### 1. **Push to GitHub**
```bash
git add .
git commit -m "Updated Merchant Hub SQL schema and Parking feature"
git push origin main
```

### 2. **Netlify Auto-Deploy**
- Netlify will automatically detect the push and start building
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

### 3. **Environment Variables**
Make sure these are set in Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MICROSOFT_TRANSLATOR_KEY=your_translator_key
VITE_MICROSOFT_TRANSLATOR_REGION=your_region
```

---

## 📋 Pre-Deployment Checklist

### ✅ **Database Setup (Supabase)**

1. **Run Merchant Hub Schema**
   - Open Supabase SQL Editor
   - Copy content from `supabase_merchant_hub_schema.sql`
   - Run the query
   - Verify tables created: `stores`, `products`, `carts`, `cart_items`, `orders`, `order_items`

2. **Run Pilgrim Guide Schema**
   - Copy content from `supabase_pilgrim_guide_schema.sql`
   - Run the query
   - Verify tables created: `student_guides`, `guide_bookings`

3. **Setup Storage Buckets**
   - Go to Supabase → Storage
   - Create buckets: `store-images`, `product-images`, `guide-documents`
   - Set public access for image buckets
   - Run `supabase_storage_setup.sql` if needed

### ✅ **Code Quality**

- [x] All TypeScript errors resolved
- [x] All imports working correctly
- [x] No console errors in development
- [x] All features tested locally
- [x] Responsive design verified

### ✅ **Features Implemented**

- [x] Merchant Hub (Store & Product Management)
- [x] Visitor Guide (Heritage, Food, Places, Parking)
- [x] Student Guides (Enrollment & Booking)
- [x] AI Product Assistant (Voice Input)
- [x] Multi-language Support (10+ languages)
- [x] Shopping Cart & Checkout
- [x] Invoice Generation

---

## 🔧 Build Configuration

### **netlify.toml** (Already configured)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **package.json scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## 🐛 Common Deployment Issues & Fixes

### **Issue 1: Build Fails - TypeScript Errors**
```bash
# Fix: Check for any TypeScript errors
npm run build

# If errors exist, fix them before deploying
```

### **Issue 2: Environment Variables Not Working**
- Ensure all `VITE_` prefixed variables are set in Netlify
- Restart the build after adding variables
- Clear cache and redeploy

### **Issue 3: 404 on Page Refresh**
- Already handled by `[[redirects]]` in netlify.toml
- Ensures SPA routing works correctly

### **Issue 4: Supabase Connection Failed**
- Verify Supabase URL and Anon Key are correct
- Check if Supabase project is active
- Verify RLS policies are set correctly

### **Issue 5: Images Not Loading**
- Check if storage buckets are public
- Verify image URLs are correct
- Ensure CORS is enabled in Supabase Storage

---

## 📊 Post-Deployment Verification

### **1. Test All Pages**
- [ ] Home page loads
- [ ] Visitor page (all tabs: Heritage, Food, Parking, Places, Guides, Market)
- [ ] Merchant page (Store setup, Product management)
- [ ] Store detail pages
- [ ] Checkout flow

### **2. Test Features**
- [ ] Language switching works
- [ ] Voice product input works
- [ ] Shopping cart functions
- [ ] Guide enrollment works
- [ ] Product search works
- [ ] Mobile responsiveness

### **3. Test Database**
- [ ] Products load from Supabase
- [ ] Stores display correctly
- [ ] Student guides show up
- [ ] Cart operations work
- [ ] Orders can be created

### **4. Performance Check**
- [ ] Page load time < 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## 🔄 Continuous Deployment

### **Automatic Deployments**
- Every push to `main` branch triggers auto-deploy
- Netlify builds and deploys automatically
- Build logs available in Netlify dashboard

### **Manual Deployment**
```bash
# If needed, trigger manual deploy
netlify deploy --prod

# Or from Netlify dashboard
# Deploys → Trigger deploy → Deploy site
```

---

## 📱 Live Site URLs

### **Production**
- URL: `https://your-site-name.netlify.app`
- Custom domain: Configure in Netlify → Domain settings

### **Preview Deployments**
- Every pull request gets a preview URL
- Test changes before merging to main

---

## 🔐 Security Checklist

- [x] Environment variables secured
- [x] Supabase RLS policies enabled
- [x] API keys not exposed in code
- [x] HTTPS enabled (automatic on Netlify)
- [x] Security headers configured
- [x] CORS properly configured

---

## 📈 Monitoring & Analytics

### **Netlify Analytics**
- Enable in Netlify dashboard
- Track page views, performance
- Monitor build times

### **Error Tracking**
- Check Netlify build logs for errors
- Monitor Supabase logs
- Use browser console for client errors

---

## 🎯 Next Steps After Deployment

1. **Test thoroughly** on production URL
2. **Share with stakeholders** for feedback
3. **Monitor** for any issues
4. **Optimize** based on performance metrics
5. **Add custom domain** if needed
6. **Enable analytics** for insights

---

## 📞 Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev

---

## ✅ Deployment Status

- **Last Updated**: 2026-01-21
- **Status**: Ready for Deployment ✅
- **Version**: 1.0.0
- **Build**: Production Ready

---

**Happy Deploying! 🚀**
