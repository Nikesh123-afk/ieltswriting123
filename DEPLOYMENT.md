# Deployment Guide - IELTS Writing Scorer

Complete step-by-step guide to deploy your IELTS Writing Scorer application to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] ✅ All code committed to Git
- [ ] ✅ Groq API key (free from [console.groq.com](https://console.groq.com/))
- [ ] ✅ Production database ready (PostgreSQL recommended)
- [ ] ✅ Domain name (optional, but recommended)
- [ ] ✅ Project builds without errors locally (`npm run build`)
- [ ] ✅ All environment variables documented

---

## 🚀 Deployment Options

Choose your preferred platform:

1. **[Vercel](#option-1-vercel-recommended)** - Best for Next.js (free tier available)
2. **[Railway](#option-2-railway)** - Includes PostgreSQL database (free tier)
3. **[Render](#option-3-render)** - Alternative with free tier
4. **[DigitalOcean](#option-4-digitalocean-app-platform)** - Paid, but reliable

---

## Option 1: Vercel (Recommended)

### Why Vercel?

- Built specifically for Next.js
- Automatic deployments from Git
- Free SSL certificates
- Global CDN
- Free tier: 100GB bandwidth/month

### Step 1: Prepare Your Database

**Option A: Vercel Postgres (Recommended)**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Storage** → **Create Database** → **Postgres**
3. Name your database (e.g., `ielts-scorer-db`)
4. Choose region (closest to your users)
5. Click **Create**
6. Copy the `DATABASE_URL` connection string

**Option B: External PostgreSQL (Neon, Supabase, etc.)**

**Using Neon (Free PostgreSQL):**

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create new project
3. Name: `ielts-scorer`
4. Copy connection string
5. Go to your project settings
6. Enable connection pooling for better performance

### Step 2: Update Database Schema for PostgreSQL

1. Open `prisma/schema.prisma`
2. Change the datasource:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

3. Commit this change:

```bash
git add prisma/schema.prisma
git commit -m "chore: switch to PostgreSQL for production"
git push
```

### Step 3: Deploy to Vercel

**Using Vercel CLI:**

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. Follow prompts:
   - Set up and deploy? **Y**
   - Scope: Select your account
   - Link to existing project? **N**
   - Project name: `ielts-writing-scorer`
   - Directory: `./` (press Enter)
   - Override settings? **N**

**Using Vercel Dashboard (Easier):**

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
5. Click **Deploy**

### Step 4: Configure Environment Variables on Vercel

1. In your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```env
# AI Model (Required)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Database (Required)
DATABASE_URL=your_postgresql_connection_string_here

# NextAuth (Required)
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate_new_secret_with_openssl_rand_base64_32

# Node Environment
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

4. Click **Save** for each variable

### Step 5: Run Database Migration

**Option A: Using Vercel CLI**

```bash
# Set environment variables locally for migration
export DATABASE_URL="your_production_database_url"

# Run migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

**Option B: Using Prisma Data Platform**

1. Go to [cloud.prisma.io](https://cloud.prisma.io)
2. Connect your repository
3. Run migrations from dashboard

**Option C: Via Vercel Build Command**

1. In Vercel Settings → General
2. Override Build Command:

```bash
npx prisma generate && npx prisma migrate deploy && next build
```

### Step 6: Redeploy Application

```bash
vercel --prod
```

Or trigger redeploy from Vercel Dashboard → Deployments → Redeploy

### Step 7: Verify Deployment

1. Visit your deployment URL: `https://your-app-name.vercel.app`
2. Test signup: Create new account
3. Test login: Sign in with account
4. Test scoring: Submit an essay
5. Check dashboard: View essay history

---

## Option 2: Railway

### Why Railway?

- Includes PostgreSQL database
- Simple setup
- Free tier: $5 credit/month
- One-click deployment

### Step 1: Setup Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **New Project**
4. Select **Deploy from GitHub repo**
5. Choose your repository

### Step 2: Add PostgreSQL Database

1. In your Railway project
2. Click **New** → **Database** → **PostgreSQL**
3. Wait for database to provision
4. Railway will automatically set `DATABASE_URL` variable

### Step 3: Configure Environment Variables

1. Click on your **Next.js service**
2. Go to **Variables** tab
3. Add variables:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
NEXTAUTH_SECRET=your_secret_here_use_openssl_rand
NODE_ENV=production
```

**Important:** `DATABASE_URL` is automatically set by Railway

4. For `NEXTAUTH_URL`:
   - First deploy without it to get your Railway URL
   - Then add: `NEXTAUTH_URL=https://your-app.up.railway.app`
   - Redeploy

### Step 4: Update Database Schema

Same as Vercel Step 2 - switch to PostgreSQL in `schema.prisma`

### Step 5: Configure Build Settings

1. In **Settings** → **Deploy**
2. **Build Command**:

```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

3. **Start Command**: `npm start`

### Step 6: Deploy

1. Push to your Git repository
2. Railway will automatically deploy
3. View logs in Railway dashboard
4. Once deployed, your app URL will be shown

### Step 7: Run Database Migrations

Railway automatically runs migrations if included in build command (Step 5)

Or manually via Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npx prisma migrate deploy
```

---

## Option 3: Render

### Step 1: Setup Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New** → **Web Service**
4. Connect your repository

### Step 2: Configure Service

**Basic Settings:**

- **Name**: `ielts-writing-scorer`
- **Environment**: `Node`
- **Region**: Choose closest to users
- **Branch**: `main` or `master`
- **Build Command**:

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

- **Start Command**: `npm start`

### Step 3: Create PostgreSQL Database

1. Click **New** → **PostgreSQL**
2. Name: `ielts-scorer-db`
3. Database name: `ielts_scorer`
4. Free plan is fine for starting
5. Click **Create Database**
6. Copy **Internal Database URL**

### Step 4: Add Environment Variables

In your Web Service → Environment:

```env
DATABASE_URL=your_render_postgres_internal_url
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
NEXTAUTH_URL=https://your-app.onrender.com
NEXTAUTH_SECRET=your_secret_here
NODE_ENV=production
```

### Step 5: Deploy

1. Click **Create Web Service**
2. Render will automatically deploy
3. Monitor deployment logs
4. Access your app at `https://your-app.onrender.com`

---

## Option 4: DigitalOcean App Platform

### Step 1: Create App

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Click **Create** → **Apps**
3. Connect GitHub and select repository
4. Choose branch: `main`

### Step 2: Create Database

1. In App configuration, click **Add Resource**
2. Select **Database**
3. Choose **PostgreSQL**
4. Select plan (starting at $15/month)
5. Database will be auto-linked

### Step 3: Configure Environment Variables

```env
GROQ_API_KEY=${your_groq_api_key}
GROQ_MODEL=llama-3.3-70b-versatile
NEXTAUTH_SECRET=${your_secret}
NODE_ENV=production
```

`DATABASE_URL` and `NEXTAUTH_URL` are auto-set by DigitalOcean

### Step 4: Configure Build

- **Build Command**:

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

- **Run Command**: `npm start`

### Step 5: Deploy

Click **Create Resources** and DigitalOcean will deploy

---

## 🔧 Post-Deployment Configuration

### 1. Verify Environment Variables

Visit `/api/health` or create a health check endpoint to verify:

- Database connection
- API keys loaded
- Environment variables set

### 2. Run Initial Database Migration

If not done automatically:

```bash
npx prisma migrate deploy
```

### 3. Create Admin/Test Account

Via deployed app:

1. Go to `/auth/signup`
2. Create test account
3. Sign in and test all features

### 4. Test All Features

- [ ] User signup/login
- [ ] Essay submission
- [ ] Scoring functionality
- [ ] Dashboard loading
- [ ] Essay history
- [ ] Profile updates

### 5. Setup Custom Domain (Optional)

**Vercel:**

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

**Railway/Render:**

1. Similar process in platform settings
2. Add CNAME record pointing to platform URL
3. Update `NEXTAUTH_URL`

### 6. Configure Monitoring (Recommended)

**Vercel:**

- Built-in analytics available
- Error tracking via Vercel dashboard

**Alternative Monitoring:**

- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [Vercel Analytics](https://vercel.com/analytics) - Performance

---

## 🔒 Production Security Checklist

- [ ] ✅ Strong `NEXTAUTH_SECRET` generated (32+ characters)
- [ ] ✅ `DATABASE_URL` uses SSL connection (`?sslmode=require`)
- [ ] ✅ All environment variables set in platform (not in code)
- [ ] ✅ `.env.local` added to `.gitignore`
- [ ] ✅ CORS configured if using custom domain
- [ ] ✅ Rate limiting enabled (consider Vercel Edge Config)
- [ ] ✅ Database backups configured
- [ ] ✅ SSL/TLS enabled (automatic on most platforms)

---

## 🐛 Troubleshooting

### Build Failures

**"Cannot find module '@prisma/client'"**

```bash
# Add to build command
npx prisma generate && npm run build
```

**"DATABASE_URL is not set"**

- Verify environment variable in platform dashboard
- Check spelling and format
- Ensure it's set for production environment

### Runtime Errors

**"NextAuth configuration error"**

- Verify `NEXTAUTH_URL` matches your deployment URL
- Ensure `NEXTAUTH_SECRET` is set
- Check that both variables are in production environment

**"Failed to connect to database"**

- Verify `DATABASE_URL` is correct
- Check if database is running
- Verify network access/firewall rules
- Add `?sslmode=require` to connection string

**"Groq API error"**

- Verify `GROQ_API_KEY` is valid
- Check API rate limits
- Ensure model name is correct: `llama-3.3-70b-versatile`

### Migration Issues

**"Migration failed"**

```bash
# Reset and reapply migrations
npx prisma migrate reset --force
npx prisma migrate deploy
```

**"Table already exists"**

```bash
# Use migrate deploy instead of migrate dev
npx prisma migrate deploy
```

---

## 📊 Monitoring Your Deployment

### Check Application Health

Create a health check endpoint in `app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

### Monitor Logs

**Vercel:**

```bash
vercel logs your-deployment-url
```

**Railway:**

- View logs in Railway dashboard
- Or use Railway CLI: `railway logs`

**Render:**

- View logs in Render dashboard under Logs tab

---

## 🔄 Continuous Deployment

### Automatic Deployments

All platforms support automatic deployment on Git push:

1. **Vercel**: Auto-deploys on push to connected branch
2. **Railway**: Auto-deploys on push to main/master
3. **Render**: Auto-deploys on push to configured branch

### Manual Deployments

**Vercel:**

```bash
vercel --prod
```

**Railway:**

```bash
railway up
```

**Render:**

- Trigger manual deploy from dashboard

---

## 💰 Cost Estimation

### Free Tier Options

**Vercel (Hobby Plan - FREE)**

- Next.js hosting
- 100GB bandwidth/month
- 100 deployments/day
- Best for: Small to medium traffic

**Railway (Free $5 credit/month)**

- Web app + PostgreSQL
- Good for: Development/testing

**Render (Free Tier)**

- Web service + PostgreSQL
- Spins down after inactivity
- Good for: Testing/demos

### Paid Recommendations (Production)

**For Production Traffic:**

- **Vercel Pro**: $20/month (1TB bandwidth)
- **Railway**: ~$5-20/month (pay-as-you-go)
- **Render**: $7-25/month (always-on service)
- **Database**: $7-15/month (dedicated PostgreSQL)

---

## ✅ Final Deployment Checklist

- [ ] Application builds successfully
- [ ] Database schema migrated
- [ ] All environment variables set
- [ ] Test account created
- [ ] Essay scoring works
- [ ] Authentication functional
- [ ] Dashboard accessible
- [ ] Health check passes
- [ ] Custom domain configured (optional)
- [ ] Monitoring setup (optional)
- [ ] Backups configured
- [ ] SSL enabled
- [ ] Error tracking active

---

## 🎉 You're Live!

Your IELTS Writing Scorer is now deployed and ready to help students worldwide!

### Share Your App

- Production URL: `https://your-app.vercel.app`
- Custom Domain: `https://your-domain.com`

### Next Steps

1. Share with users
2. Collect feedback
3. Monitor performance
4. Add new features
5. Scale as needed

---

**Need Help?**

- Check platform-specific documentation
- Review application logs
- Test locally first: `npm run build && npm start`
- Verify all environment variables

**Good luck with your deployment! 🚀**
