# 🚀 Netlify Deployment Guide - Kumbh Vyapaar

## ✅ **Complete Deployment Instructions**

Deploy your Kumbh Vyapaar application to Netlify in minutes!

---

## 📋 **Pre-Deployment Checklist**

- [ ] Code is committed to Git
- [ ] Supabase project is set up
- [ ] Microsoft Translator API key obtained (optional)
- [ ] All environment variables ready

---

## 🚀 **Method 1: Deploy via Netlify Dashboard (Recommended)**

### **Step 1: Prepare Your Repository**

1. **Push to GitHub/GitLab/Bitbucket**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### **Step 2: Create Netlify Account**

1. Go to [Netlify](https://www.netlify.com/)
2. Click "Sign up" (free account)
3. Sign up with GitHub/GitLab/Bitbucket

### **Step 3: Import Project**

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose your Git provider (GitHub/GitLab/Bitbucket)
3. Authorize Netlify to access your repositories
4. Select **`nashik-connect-lingo`** repository

### **Step 4: Configure Build Settings**

**Build Settings:**
- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Base directory**: (leave empty)

### **Step 5: Add Environment Variables**

Click **"Show advanced"** → **"New variable"**

Add these variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MICROSOFT_TRANSLATOR_KEY=your_translator_key
VITE_MICROSOFT_TRANSLATOR_REGION=your_region
```

**Where to find these:**

**Supabase:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click "Settings" → "API"
4. Copy **Project URL** → `VITE_SUPABASE_URL`
5. Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

**Microsoft Translator:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Your Translator resource → "Keys and Endpoint"
3. Copy **KEY 1** → `VITE_MICROSOFT_TRANSLATOR_KEY`
4. Copy **REGION** → `VITE_MICROSOFT_TRANSLATOR_REGION`

### **Step 6: Deploy**

1. Click **"Deploy site"**
2. Wait for build to complete (2-5 minutes)
3. Your site is live! 🎉

---

## 🚀 **Method 2: Deploy via Netlify CLI**

### **Step 1: Install Netlify CLI**

```bash
npm install -g netlify-cli
```

### **Step 2: Login to Netlify**

```bash
netlify login
```

### **Step 3: Initialize Netlify**

```bash
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Site name: `kumbh-vyapaar` (or your choice)
- Build command: `npm run build`
- Publish directory: `dist`

### **Step 4: Set Environment Variables**

```bash
netlify env:set VITE_SUPABASE_URL "your_supabase_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
netlify env:set VITE_MICROSOFT_TRANSLATOR_KEY "your_translator_key"
netlify env:set VITE_MICROSOFT_TRANSLATOR_REGION "your_region"
```

### **Step 5: Deploy**

```bash
# Deploy to production
netlify deploy --prod

# Or deploy to preview first
netlify deploy
```

---

## 📝 **Create netlify.toml Configuration**

Create `netlify.toml` in your project root:

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

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🔧 **Build Optimization**

### **Update package.json**

Ensure these scripts exist:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### **Optimize Build**

Add to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

---

## 🌐 **Custom Domain Setup**

### **Option 1: Netlify Subdomain (Free)**

Your site will be: `your-site-name.netlify.app`

### **Option 2: Custom Domain**

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `kumbhvyapaar.com`)
4. Follow DNS configuration instructions
5. Netlify provides free SSL certificate

**DNS Settings:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

---

## 🔒 **Environment Variables Security**

### **Important:**
- ✅ Never commit `.env` to Git
- ✅ Add `.env` to `.gitignore`
- ✅ Use Netlify's environment variables
- ✅ Supabase anon key is safe for client-side

### **Check .gitignore:**

```gitignore
# Environment variables
.env
.env.local
.env.production

# Build output
dist
dist-ssr
*.local

# Dependencies
node_modules

# Logs
*.log
```

---

## 📊 **Post-Deployment Checklist**

After deployment:

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Images load properly
- [ ] Supabase connection works
- [ ] Authentication works
- [ ] Language picker works
- [ ] Translation works (if API key added)
- [ ] Mobile responsive
- [ ] No console errors

---

## 🔍 **Testing Your Deployment**

### **1. Test Homepage**
```
https://your-site-name.netlify.app/
```

### **2. Test Routes**
```
https://your-site-name.netlify.app/visitor
https://your-site-name.netlify.app/merchant
https://your-site-name.netlify.app/checkout
```

### **3. Test Features**
- [ ] Language selection
- [ ] User authentication
- [ ] Product listing
- [ ] Store detail page
- [ ] Checkout flow
- [ ] Mobile menu

---

## 🐛 **Troubleshooting**

### **Build Fails:**

**Error: "Command failed"**
```bash
# Solution: Check build command
npm run build
# If it works locally, check Node version
```

**Error: "Module not found"**
```bash
# Solution: Install dependencies
npm install
```

### **Site Loads but Features Don't Work:**

**Supabase not connecting:**
- Check environment variables are set
- Check Supabase URL is correct
- Check anon key is correct

**Translation not working:**
- Check Microsoft Translator key is set
- Check region is correct
- Translation is optional, site works without it

### **404 Errors on Routes:**

**Solution:** Add to `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🔄 **Continuous Deployment**

Once set up, Netlify automatically:
- ✅ Deploys on every push to `main`
- ✅ Creates preview for pull requests
- ✅ Runs build checks
- ✅ Provides deploy previews

**Disable auto-deploy:**
1. Site settings → Build & deploy
2. Stop builds → Disable

---

## 📈 **Performance Optimization**

### **1. Enable Netlify Features:**

- **Asset Optimization**: Auto-enabled
- **Pretty URLs**: Auto-enabled
- **HTTPS**: Auto-enabled
- **CDN**: Auto-enabled

### **2. Add Performance Headers:**

In `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 💰 **Netlify Pricing**

### **Free Tier (Perfect for this project):**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Free SSL
- ✅ Free CDN
- ✅ Automatic deployments

### **When to Upgrade:**
- More than 100 GB bandwidth
- Need more build minutes
- Want team features

---

## 🎯 **Quick Deploy Commands**

```bash
# Build locally
npm run build

# Preview build
npm run preview

# Deploy to Netlify (after setup)
netlify deploy --prod

# Check deploy status
netlify status

# Open site in browser
netlify open:site
```

---

## 📱 **Mobile Testing**

Test on mobile devices:
1. Open site on phone
2. Test all features
3. Check responsive design
4. Test touch interactions

---

## ✅ **Final Checklist**

Before going live:

- [ ] All features tested
- [ ] Mobile responsive verified
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Performance optimized
- [ ] Error pages work
- [ ] Analytics added (optional)

---

## 🎉 **You're Live!**

Your Kumbh Vyapaar application is now deployed on Netlify!

**Share your site:**
```
https://your-site-name.netlify.app
```

**Next steps:**
1. Share with users
2. Monitor analytics
3. Gather feedback
4. Iterate and improve

---

## 📞 **Support**

**Netlify Issues:**
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community](https://answers.netlify.com/)
- [Netlify Status](https://www.netlifystatus.com/)

**Build Issues:**
- Check build logs in Netlify dashboard
- Test build locally first
- Check Node version matches

**Deployment successful! Your app is live! 🚀🎉**
