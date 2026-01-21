# 🚀 QUICK DEPLOYMENT REFERENCE

## ⚡ FASTEST PATH TO DEPLOYMENT

### 1️⃣ **Supabase** (5 minutes)
```
1. Open: https://app.supabase.com
2. SQL Editor → New Query
3. Copy & Run: supabase_merchant_hub_schema.sql
4. Copy & Run: supabase_pilgrim_guide_schema.sql
5. Done! ✅
```

### 2️⃣ **GitHub** (2 minutes)
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 3️⃣ **Netlify** (Auto - 3 minutes)
```
✅ Detects push automatically
✅ Builds: npm run build
✅ Deploys to production
✅ Live! 🎉
```

---

## 📋 ENVIRONMENT VARIABLES (Netlify Dashboard)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MICROSOFT_TRANSLATOR_KEY=your-key
VITE_MICROSOFT_TRANSLATOR_REGION=eastus
```

---

## ✅ WHAT'S INCLUDED

### **Visitor Features**
- ✅ Heritage Sites
- ✅ Food Trail
- ✅ **Parking (4 spots)** 🅿️
- ✅ Famous Places
- ✅ Student Guides
- ✅ Marketplace

### **Merchant Features**
- ✅ Store Management
- ✅ Product Catalog
- ✅ AI Voice Input
- ✅ Order Management

### **Shopping**
- ✅ Shopping Cart
- ✅ Checkout
- ✅ Order Tracking

### **Advanced**
- ✅ 10+ Languages
- ✅ Voice Input
- ✅ Mobile Responsive
- ✅ Secure Auth

---

## 🎯 QUICK TEST CHECKLIST

After deployment, test:
- [ ] Visit `/visitor` - All tabs work
- [ ] **Parking tab shows 4 locations** 🅿️
- [ ] Visit `/merchant` - Store setup works
- [ ] Language switching works
- [ ] Mobile view looks good

---

## 🆘 QUICK FIXES

**Build fails?**
→ Check Netlify build logs

**Database error?**
→ Verify Supabase SQL ran successfully

**Env vars not working?**
→ Restart build after adding them

**404 on refresh?**
→ Already fixed in netlify.toml ✅

---

## 📊 DATABASE TABLES

**Merchant Hub (6)**
- stores
- products
- carts
- cart_items
- orders
- order_items

**Pilgrim Guide (2)**
- student_guides
- guide_bookings

---

## 🎉 YOU'RE READY!

**Total Time: ~10 minutes**

1. Run SQL (5 min)
2. Push code (2 min)
3. Auto-deploy (3 min)

**DONE! 🚀**
