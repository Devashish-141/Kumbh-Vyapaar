# Netlify Deployment Guide for Nashik Connect Lingo

This guide explains how to deploy your **Nashik Connect Lingo** application to Netlify.

## 1. Prerequisites

Ensure you have the following environment variables ready (from your `.env` file):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 2. Deployment Methods

### Option A: Deploy via Git (Recommended)
This method automatically redeploys your site whenever you push changes to GitHub.

1. **Push your code** to a GitHub repository.
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **"Add new site"** > **"Import from an existing project"**.
4. Select **GitHub** and authorize.
5. Choose your `nashik-connect-lingo` repository.
6. **Build Settings** should be automatically detected (verify them):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. **Environment Variables**:
   - Click "Add environment variables".
   - Add `VITE_SUPABASE_URL` and your value.
   - Add `VITE_SUPABASE_ANON_KEY` and your value.
8. Click **"Deploy site"**.

### Option B: Drag and Drop (Manual)
1. Run `npm run build` in your local terminal.
2. This will create a `dist` folder.
3. Log in to [Netlify](https://app.netlify.com/).
4. Click **"Add new site"** > **"Deploy manually"**.
5. Drag and drop the `dist` folder onto the build area.
6. **Note**: For Supabase to work, you might need to set up Environment Variables in "Site settings" > "Environment variables" after the initial deploy (the first deploy might fail to fetch data if keys are missing from the build, but actually Vite embeds them during build time if they are in your local `.env`. If you deploy via Drag & Drop `dist`, the keys are *already* inside the files).

## 3. Configuration Check (`netlify.toml`)
A `netlify.toml` file is already included in your project root. It handles:
- **SPA Redirects**: Ensures refreshing pages (like `/visitor` or `/merchant`) doesn't give a 404 error.
- **Security Headers**: Sets policies for geolocation, camera, and caching.

## 4. Troubleshooting

- **Page Not Found (404) on Refresh**: 
  - Ensure `netlify.toml` is present in the root.
  - It should contain `[[redirects]] from = "/*" to = "/index.html" status = 200`.

- **Supabase Connection Failed**: 
  - Check browser console (F12).
  - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct in Netlify Site Settings.
  - *Note*: You must trigger a **new build** after adding environment variables in Netlify.

- **Images Not Loading**:
  - Ensure assets are in the `public` folder or imported correctly in the code.
  - Check case sensitivity (Linux servers are case-sensitive, Windows is not).

## 5. Domain Setup (Optional)
Once deployed, you can add a custom domain (e.g., `nashik-connect.com`) in **Domain management** settings on Netlify.
