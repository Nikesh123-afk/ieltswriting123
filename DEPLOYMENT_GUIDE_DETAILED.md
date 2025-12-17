# Complete Deployment Guide for IELTS Writing Scorer

## Step-by-Step Production Deployment Process

This guide will walk you through deploying your IELTS Writing Scorer application from start to finish, specifically tailored to your project configuration.

---

# 🎯 RECOMMENDED: Vercel + Neon PostgreSQL (100% Free)

This is the **easiest and most cost-effective** deployment option for your Next.js project.

---

## Part 1: Pre-Deployment Preparation (15 minutes)

### Step 1: Verify Your Local Setup

Open PowerShell in your project directory and run:

```powershell
cd C:\Users\nikes\OneDrive\Desktop\writing

# Test build
npm run build
```

**Expected Output:** Build should complete without errors.

If you see errors:

```powershell
# Fix any TypeScript errors first
npm run lint
```

### Step 2: Commit All Changes to Git

```powershell
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "chore: prepare for production deployment"
```

### Step 3: Push to GitHub

If you haven't already:

```powershell
# Create new repository on GitHub first, then:
git remote add origin https://github.com/YOUR-USERNAME/ielts-writing-scorer.git
git branch -M main
git push -u origin main
```

If already connected:

```powershell
git push
```

---

## Part 2: Setup Free PostgreSQL Database (10 minutes)

### Step 1: Create Neon Account (Free PostgreSQL)

1. Go to **https://neon.tech**
2. Click **"Sign up"** (use GitHub for faster setup)
3. Click **"Create a project"**

### Step 2: Configure Database

Fill in details:

- **Project name**: `ielts-scorer`
- **Database name**: `ielts_db`
- **Region**: Choose closest to your target users
  - US East (Ohio) for North America
  - EU (Frankfurt) for Europe
  - Asia Pacific (Singapore) for Asia
- **Postgres version**: 16 (latest)

Click **"Create Project"**

### Step 3: Get Connection String

1. After project creation, you'll see **Connection Details**
2. Select **"Prisma"** from the dropdown
3. Copy the connection string - looks like:

```
postgresql://username:password@ep-xxxxx.region.neon.tech/ielts_db?sslmode=require
```

4. **SAVE THIS** - you'll need it in Step 5

### Step 4: Update Your Prisma Schema for PostgreSQL

Open `prisma/schema.prisma` in your editor and change:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

Save the file.

### Step 5: Test Database Connection Locally

Create a temporary `.env.test` file:

```powershell
# Create test environment file
echo 'DATABASE_URL="your_neon_connection_string_here"' > .env.test
```

Replace `your_neon_connection_string_here` with your actual Neon connection string.

Test the connection:

```powershell
# Set the DATABASE_URL temporarily
$env:DATABASE_URL="your_neon_connection_string_here"

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

**Expected Output:** Tables created successfully.

### Step 6: Commit Database Changes

```powershell
git add prisma/schema.prisma
git commit -m "chore: switch to PostgreSQL for production"
git push
```

---

## Part 3: Get Groq API Key (5 minutes)

### Step 1: Create Groq Account

1. Go to **https://console.groq.com**
2. Click **"Sign up"** (use Google/GitHub)
3. Verify your email

### Step 2: Generate API Key

1. After login, go to **"API Keys"** in left menu
2. Click **"Create API Key"**
3. Name it: `ielts-scorer-production`
4. Click **"Create"**
5. **COPY THE KEY** - it looks like: `gsk_...`
6. **SAVE THIS** - you won't be able to see it again

---

## Part 4: Generate NextAuth Secret (2 minutes)

Open PowerShell and run:

```powershell
# Generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**COPY THE OUTPUT** - it will look like: `abcd1234efgh5678+ijkl/9012==`

---

## Part 5: Deploy to Vercel (15 minutes)

### Step 1: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. **Choose "Hobby"** (Free plan)
4. Sign up with **GitHub** (recommended)
5. Authorize Vercel to access your repositories

### Step 2: Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find **"ielts-writing-scorer"** (or your repo name)
4. Click **"Import"**

### Step 3: Configure Project Settings

You'll see a configuration screen:

**Framework Preset:** Next.js (should be auto-detected)
**Root Directory:** `./` (leave as is)
**Build Command:** Leave default `npm run build`
**Output Directory:** Leave default `.next`

**DO NOT CLICK DEPLOY YET!**

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section.

Add these variables one by one:

#### Variable 1: GROQ_API_KEY

- **Name:** `GROQ_API_KEY`
- **Value:** `gsk_...` (your Groq API key from Part 3)
- Click **"Add"**

#### Variable 2: GROQ_MODEL

- **Name:** `GROQ_MODEL`
- **Value:** `llama-3.3-70b-versatile`
- Click **"Add"**

#### Variable 3: DATABASE_URL

- **Name:** `DATABASE_URL`
- **Value:** Your Neon PostgreSQL connection string (from Part 2, Step 3)
  - Should look like: `postgresql://username:password@ep-xxxxx.neon.tech/ielts_db?sslmode=require`
- Click **"Add"**

#### Variable 4: NEXTAUTH_SECRET

- **Name:** `NEXTAUTH_SECRET`
- **Value:** The random string you generated in Part 4
- Click **"Add"**

#### Variable 5: NODE_ENV

- **Name:** `NODE_ENV`
- **Value:** `production`
- Click **"Add"**

### Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait for deployment (2-5 minutes)
3. You'll see logs scrolling - this is normal
4. Watch for:
   - ✓ Installing dependencies
   - ✓ Building application
   - ✓ Deployment ready

### Step 6: Get Your Deployment URL

After successful deployment:

1. You'll see **"Congratulations!"** message
2. Your app URL will be shown: `https://ielts-writing-scorer-xxx.vercel.app`
3. **COPY THIS URL**

### Step 7: Add NEXTAUTH_URL

**IMPORTANT:** You need to add one more environment variable with your deployment URL.

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add new variable:
   - **Name:** `NEXTAUTH_URL`
   - **Value:** `https://your-actual-deployment-url.vercel.app` (from Step 6)
   - Select **"Production"** environment
4. Click **"Save"**

### Step 8: Redeploy with New Variable

1. Go to **"Deployments"** tab
2. Click the three dots (**...**) on the latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"**
5. Click **"Redeploy"**
6. Wait for redeployment (1-2 minutes)

---

## Part 6: Setup Database Schema in Production (5 minutes)

### Method 1: Using Vercel CLI (Recommended)

Install Vercel CLI:

```powershell
npm install -g vercel
```

Login to Vercel:

```powershell
vercel login
```

Follow the browser authentication.

Link your project:

```powershell
# In your project directory
cd C:\Users\nikes\OneDrive\Desktop\writing
vercel link
```

Select:

- Your Vercel scope (your username)
- Link to existing project: **Yes**
- Choose: `ielts-writing-scorer`

Pull environment variables:

```powershell
vercel env pull .env.production
```

Run database migration:

```powershell
# Use the production DATABASE_URL
$env:DATABASE_URL=(Get-Content .env.production | Select-String "DATABASE_URL").ToString().Split("=")[1]

# Run migration
npx prisma migrate deploy
```

**Expected Output:** "Migration successful"

### Method 2: Using Neon Console (Alternative)

If Method 1 doesn't work:

1. Go to your Neon dashboard: https://console.neon.tech
2. Select your project
3. Click **"SQL Editor"**
4. Copy the SQL from `prisma/migrations/YOUR_MIGRATION/migration.sql`
5. Paste and run in SQL Editor

---

## Part 7: Verify Deployment (10 minutes)

### Step 1: Visit Your Live Application

Open your deployment URL: `https://your-app.vercel.app`

### Step 2: Test Signup

1. Click **"Sign Up"** (or go to `/auth/signup`)
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123456`
3. Click **"Sign Up"**

**Expected:** Redirect to dashboard or login

### Step 3: Test Login

1. Go to **"Sign In"** (or `/auth/login`)
2. Login with credentials from Step 2
3. Click **"Sign In"**

**Expected:** Redirect to dashboard showing "No essays yet"

### Step 4: Test Essay Scoring

1. In dashboard, find essay submission form (or go to main page)
2. Fill in:
   - **Task Type:** Task 2
   - **Module:** Academic
   - **Prompt:** `Some people think that the government should provide free education. To what extent do you agree or disagree?`
   - **Essay:** Paste a sample essay (250+ words)

Sample essay to use:

```
Education is a fundamental right that should be accessible to everyone. While some argue that individuals should pay for their own education, I strongly believe that the government should provide free education at all levels.

Firstly, free education ensures equal opportunities for all citizens regardless of their economic background. Many talented students from poor families cannot afford quality education, which limits their potential and perpetuates social inequality. By providing free education, governments can help break this cycle and create a more equitable society.

Secondly, investing in education benefits the entire economy. Educated citizens are more productive, innovative, and contribute more to economic growth. Countries with high levels of education tend to have stronger economies and better living standards. Therefore, government spending on education should be seen as an investment rather than an expense.

However, I acknowledge that funding free education requires significant resources, which could strain government budgets. Nevertheless, I believe that the long-term benefits far outweigh the costs. Governments can find innovative ways to fund education, such as redirecting resources from less essential areas or implementing progressive taxation.

In conclusion, while there are financial challenges, I firmly believe that free education is essential for social equality and economic prosperity. Governments should prioritize education funding to ensure that all citizens have access to quality learning opportunities.
```

3. Click **"Score Essay"**
4. Wait 15-30 seconds

**Expected Results:**

- ✓ Overall Band Score displayed (e.g., 7.0)
- ✓ Four criterion scores shown
- ✓ Executive summary
- ✓ Detailed feedback for each criterion
- ✓ Highlighted issues with suggestions
- ✓ Revision plan

### Step 5: Test Dashboard

1. Go to **"Dashboard"** (or `/dashboard`)
2. You should see your submitted essay listed
3. Click on the essay

**Expected:** Full scoring results displayed

### Step 6: Test Profile

1. Go to **"Profile"** (or `/profile`)
2. Try updating your name
3. Click **"Update Profile"**

**Expected:** Success message, name updated

---

## Part 8: Monitor Your Deployment

### Check Vercel Logs

1. In Vercel dashboard → **"Logs"** tab
2. Look for any errors (red lines)
3. Should see mostly green ✓ checkmarks

### View Analytics

1. Go to **"Analytics"** tab
2. You'll see:
   - Page views
   - Response times
   - Top pages visited

---

## Part 9: Optional Enhancements

### Add Custom Domain (Optional)

**If you own a domain:**

1. In Vercel project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain: `yourdomain.com`
4. Follow DNS configuration instructions:
   - Add **A record** or **CNAME record** in your domain registrar
   - Wait for DNS propagation (5-60 minutes)
5. Update `NEXTAUTH_URL`:
   - Go to **Settings** → **Environment Variables**
   - Edit `NEXTAUTH_URL` to `https://yourdomain.com`
   - Redeploy

### Setup Error Monitoring (Recommended)

**Sentry (Free tier available):**

1. Go to **https://sentry.io**
2. Sign up and create project
3. Choose **Next.js**
4. Follow setup instructions
5. Add Sentry environment variables to Vercel

---

## Part 10: Troubleshooting Common Issues

### Issue 1: "Cannot find module @prisma/client"

**Solution:**

```powershell
# Locally
npm install
npx prisma generate

# Then push and redeploy
git add .
git commit -m "fix: regenerate prisma client"
git push
```

### Issue 2: "NextAuth configuration error"

**Fix:**

1. Verify `NEXTAUTH_URL` matches your deployment URL exactly
2. Verify `NEXTAUTH_SECRET` is set
3. Redeploy after changes

### Issue 3: "Failed to connect to database"

**Fix:**

1. Verify `DATABASE_URL` in Vercel environment variables
2. Ensure connection string includes `?sslmode=require`
3. Check Neon database is active (free tier sleeps after inactivity)
4. Go to Neon console and "wake" database if needed

### Issue 4: "Groq API error"

**Fix:**

1. Verify `GROQ_API_KEY` is correct
2. Check you haven't exceeded Groq rate limits (unlikely on free tier)
3. Try regenerating API key in Groq console

### Issue 5: Build fails

**Fix:**

```powershell
# Test build locally first
npm run build

# If local build works, clear Vercel cache:
# In Vercel → Deployments → ... → Redeploy (uncheck "Use existing Build Cache")
```

### Issue 6: Migration errors

**Fix:**

```powershell
# Reset migrations (CAREFUL: deletes data)
npx prisma migrate reset --force

# Or, apply specific migration
npx prisma migrate deploy
```

---

## ✅ Post-Deployment Checklist

Go through this checklist to ensure everything works:

- [ ] ✅ Application loads at deployment URL
- [ ] ✅ Can create new account (signup works)
- [ ] ✅ Can login with created account
- [ ] ✅ Can submit essay for scoring
- [ ] ✅ Scoring completes within 30 seconds
- [ ] ✅ Results display correctly with all scores
- [ ] ✅ Dashboard shows essay history
- [ ] ✅ Can view individual essay details
- [ ] ✅ Can update profile information
- [ ] ✅ Can logout and login again
- [ ] ✅ No errors in Vercel logs
- [ ] ✅ Database shows correct data (check in Neon console)

---

## 📊 Understanding Your Free Tier Limits

### Vercel (Hobby - FREE)

- ✅ 100GB bandwidth/month
- ✅ 100 deployments/day
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- **Good for:** ~10,000 essay submissions/month

### Neon PostgreSQL (FREE)

- ✅ 0.5GB storage
- ✅ 10 branches (for different environments)
- ✅ Autoscaling compute
- ✅ Automatic backups (1 day retention)
- **Good for:** ~5,000 essays stored

### Groq (FREE)

- ✅ 14,400 requests/day
- ✅ 7,200 requests/minute rate limit
- ✅ Free tier includes all models
- **Good for:** ~450 essays scored/day

---

## 🚀 Your Application is Live!

### Share Your App

Your app is now live at: **https://your-app.vercel.app**

### Monitor Usage

- **Vercel Dashboard:** Check deployment logs and analytics
- **Neon Dashboard:** Monitor database usage
- **Groq Console:** Track API usage

### Next Steps

1. Share with friends or colleagues for testing
2. Collect feedback
3. Add features (see CONTRIBUTING.md)
4. Scale when needed (upgrade tiers if limits exceeded)

---

## 💡 Pro Tips

1. **Bookmark your URLs:**

   - Deployment: https://your-app.vercel.app
   - Vercel Dashboard: https://vercel.com/dashboard
   - Neon Console: https://console.neon.tech
   - Groq Console: https://console.groq.com

2. **Save your credentials securely:**

   - Create a password manager entry
   - Store all API keys safely
   - Keep Neon connection string accessible

3. **Monitor regularly:**

   - Check Vercel logs weekly
   - Review Neon storage usage
   - Monitor Groq API usage

4. **Backup your database:**

   - Neon provides automatic backups
   - Export data monthly: Use Neon's export feature
   - Keep a local backup of important essays

5. **Update dependencies:**

```powershell
# Monthly updates
npm update
npm audit fix
git add .
git commit -m "chore: update dependencies"
git push
```

---

## 📞 Getting Help

If you encounter issues:

1. **Check Vercel logs** first (most issues show here)
2. **Review environment variables** (common cause of errors)
3. **Test locally** with production environment:
   ```powershell
   vercel env pull .env.local
   npm run build
   npm start
   ```
4. **Check documentation:**
   - Vercel: https://vercel.com/docs
   - Neon: https://neon.tech/docs
   - Next.js: https://nextjs.org/docs

---

## 🎉 Congratulations!

You've successfully deployed your IELTS Writing Scorer to production!

**Your deployment is:**

- ✅ **Live** and accessible worldwide
- ✅ **Fast** with global CDN
- ✅ **Secure** with HTTPS encryption
- ✅ **Free** (within tier limits)
- ✅ **Scalable** (upgrade when needed)

**Total Time:** ~60 minutes
**Total Cost:** $0 (Free tier)

Now go help IELTS students worldwide improve their writing! 🌍✍️

---

**Questions or issues? Refer to the troubleshooting section above or check the project README.md**
