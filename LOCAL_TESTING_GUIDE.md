# Local Testing Guide - IELTS Writing Scorer

## Pre-Deployment Testing: Verify Everything Works Locally

Follow these steps to test your application before deploying to production.

---

## Step 1: Install Dependencies (2 minutes)

Open PowerShell in your project directory:

```powershell
cd C:\Users\nikes\OneDrive\Desktop\writing

# Install all dependencies
npm install
```

**Expected Output:**

```
added XXX packages in XXs
```

If you see errors about package conflicts:

```powershell
npm install --legacy-peer-deps
```

---

## Step 2: Setup Environment Variables (3 minutes)

### Check if .env.local exists:

```powershell
# Check if file exists
Test-Path .env.local
```

**If it returns `False`**, create the file:

```powershell
# Copy example file
copy .env.example .env.local
```

### Edit .env.local file:

Open `.env.local` in your editor and fill in:

```env
# AI Model Configuration (REQUIRED)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Database (SQLite for local testing)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_secret_key_here

# Environment
NODE_ENV=development
```

### Get Groq API Key (if you don't have it):

1. Go to https://console.groq.com
2. Sign up (free)
3. Click "API Keys" → "Create API Key"
4. Copy the key (starts with `gsk_...`)
5. Paste it in `.env.local` as `GROQ_API_KEY`

### Generate NEXTAUTH_SECRET:

```powershell
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it in `.env.local` as `NEXTAUTH_SECRET`

---

## Step 3: Setup Database (2 minutes)

```powershell
# Generate Prisma Client
npx prisma generate

# Create database and tables
npx prisma migrate dev --name init
```

**Expected Output:**

```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

If you get "Migration already exists", that's fine! Run:

```powershell
npx prisma migrate deploy
```

---

## Step 4: Verify Database Schema (1 minute)

```powershell
# Open Prisma Studio to view database
npx prisma studio
```

**Expected:** Browser opens at http://localhost:5555 showing your database tables (User, Essay, Result, etc.)

Press `Ctrl+C` in PowerShell to stop Prisma Studio.

---

## Step 5: Build and Run Application (2 minutes)

### Test Build First:

```powershell
# Build the application
npm run build
```

**Expected Output:**

```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**If you see errors:**

- TypeScript errors: Fix the errors shown
- Build errors: Check the error message and fix

### Run Development Server:

```powershell
# Start development server
npm run dev
```

**Expected Output:**

```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

**Keep this PowerShell window open!** Your server is now running.

---

## Step 6: Test Application in Browser (15 minutes)

Open a new browser window and follow these tests:

### Test 1: Homepage ✓

1. Go to: **http://localhost:3000**
2. **Expected:** Homepage loads without errors
3. **Check for:**
   - No console errors (press F12 → Console tab)
   - Page displays correctly

---

### Test 2: User Signup ✓

1. Click **"Sign Up"** or go to: **http://localhost:3000/auth/signup**
2. Fill in the form:
   - **Name:** `Test User`
   - **Email:** `test@example.com`
   - **Password:** `Test123456`
   - **Confirm Password:** `Test123456`
3. Click **"Sign Up"**

**Expected:**

- Success message or redirect to login/dashboard
- No errors in console

**If you get an error:**

- Check PowerShell window for error messages
- Verify database is running: `npx prisma studio` (should show Users table)

---

### Test 3: User Login ✓

1. Go to: **http://localhost:3000/auth/login**
2. Login with:
   - **Email:** `test@example.com`
   - **Password:** `Test123456`
3. Click **"Sign In"**

**Expected:**

- Redirect to dashboard
- You should see "No essays yet" or similar message

**If login fails:**

- Check password was hashed correctly
- Check console for errors
- Verify `NEXTAUTH_SECRET` is set in `.env.local`

---

### Test 4: Essay Submission Form ✓

1. Go to: **http://localhost:3000** (or Dashboard)
2. Find the essay submission form
3. **Check that you see:**
   - Task Type dropdown (Task 1/Task 2)
   - Module dropdown (Academic/General)
   - Prompt text area
   - Essay text area
   - Submit button

---

### Test 5: Essay Scoring (IMPORTANT) ✓

This is the **most critical test** - it verifies your AI integration works.

**Fill in the form:**

**Task Type:** Task 2  
**Module:** Academic  
**Prompt:**

```
Some people believe that technology has made our lives more complicated. Others think it has made our lives easier. Discuss both views and give your own opinion.
```

**Essay:** (Copy this sample - 285 words)

```
In today's modern world, technology plays a central role in our daily lives. While some argue that technological advances have made our lives unnecessarily complex, others contend that technology has simplified many aspects of our existence. In my opinion, although technology can be overwhelming at times, it has fundamentally made our lives easier and more efficient.

On one hand, critics argue that technology has created new problems and complications. The constant connectivity through smartphones and social media can lead to information overload and stress. People often feel pressured to respond to emails and messages immediately, blurring the boundaries between work and personal life. Furthermore, the rapid pace of technological change means that we must continuously learn new systems and applications, which can be frustrating and time-consuming, especially for older generations.

On the other hand, technology has undeniably made numerous tasks more convenient and accessible. Communication across vast distances has become instantaneous and inexpensive through video calls and messaging apps. Online banking and shopping save considerable time and effort. Moreover, access to information through the internet has democratized education and knowledge, allowing people to learn virtually anything from anywhere in the world. Medical technology has also advanced significantly, improving diagnosis and treatment of diseases.

In my view, while technology does present certain challenges, its benefits far outweigh the drawbacks. The key is to use technology mindfully and maintain a healthy balance. We should embrace technological innovations that genuinely improve our quality of life while being selective about which technologies we adopt.

In conclusion, despite some complications, technology has predominantly made our lives easier by enhancing communication, increasing efficiency, and providing unprecedented access to information and services.
```

**Click "Score Essay" or "Submit"**

---

### Expected Results (15-30 seconds):

You should see a results page with:

✓ **Overall Band Score** (e.g., 7.0, 7.5)  
✓ **Four Criterion Scores:**

- Task Response: X.X
- Coherence & Cohesion: X.X
- Lexical Resource: X.X
- Grammatical Range & Accuracy: X.X

✓ **Executive Summary** (2-4 sentences)

✓ **Detailed Feedback** for each criterion

✓ **Highlighted Issues** (5-15 examples):

- Grammar issues
- Vocabulary suggestions
- Cohesion improvements
- Each with explanations and corrections

✓ **Revision Plan** (2-4 actionable items)

✓ **Educator Notes**

---

### If Scoring Fails ❌

**Check PowerShell window for errors:**

**Error: "No response from AI model"**

- **Fix:** Verify `GROQ_API_KEY` in `.env.local`
- Test key: Go to https://console.groq.com and regenerate if needed

**Error: "Failed to parse AI response"**

- **Fix:** This is a temporary AI issue, try again
- If persists, check Groq service status

**Error: "Validation failed"**

- **Check:** Your prompt files are correctly formatted
- **Verify:** `lib/prompts/system-prompt.ts` and `user-prompt.ts` exist

**Connection timeout**

- **Fix:** Check internet connection
- Groq API might be slow, wait and try again

---

### Test 6: Dashboard ✓

1. Go to: **http://localhost:3000/dashboard**
2. **Expected:** See list of your submitted essays
3. **Check:**
   - Essay you just submitted is listed
   - Shows word count
   - Shows submission date
   - Shows overall band score

---

### Test 7: Essay Details ✓

1. In Dashboard, click on your submitted essay
2. **Expected:**
   - Full essay text displayed
   - Complete scoring results
   - All feedback sections visible
   - Highlighted issues shown
   - Revision plan displayed

---

### Test 8: Profile Page ✓

1. Go to: **http://localhost:3000/profile**
2. **Expected:** See your profile information
3. Try updating:
   - Change your name to `Test User Updated`
   - Click **"Update Profile"**
4. **Expected:** Success message, name changes

---

### Test 9: Logout and Login Again ✓

1. Click **"Logout"** or **"Sign Out"**
2. **Expected:** Redirect to home or login page
3. Try accessing `/dashboard` directly
4. **Expected:** Redirect to login (protected route)
5. Login again with your credentials
6. **Expected:** Access granted to dashboard

---

## Step 7: Check for Console Errors

In your browser:

1. Press **F12** (open DevTools)
2. Go to **Console** tab
3. **Look for:**
   - ✓ **Green checkmarks:** Good
   - ⚠️ **Warnings:** Usually okay (note them)
   - ❌ **Red errors:** Need to fix

**Common warnings to ignore:**

- Hydration warnings (React)
- PropTypes warnings (development only)

**Errors to fix:**

- API errors
- Database connection errors
- Module not found errors

---

## Step 8: Check PowerShell Server Logs

Look at your PowerShell window where you ran `npm run dev`.

**Good signs:**

```
✓ Compiled successfully
✓ GET /api/score 200 in 15234ms
✓ POST /api/auth/signin 200 in 234ms
```

**Warning signs:**

```
✗ Error: [specific error message]
✗ Failed to fetch
✗ Connection refused
```

If you see errors, read them carefully and fix accordingly.

---

## Step 9: Verify Database Contents

```powershell
# Open Prisma Studio again (in a new PowerShell window)
npx prisma studio
```

1. Go to **User** table
   - Should see your test user
   - Email: test@example.com
2. Go to **Essay** table
   - Should see your submitted essay
   - Check wordCount, taskType, module
3. Go to **Result** table
   - Should see scoring results
   - Check overallBand matches what you saw
   - Check criteriaFeedback is stored as JSON string

---

## ✅ Full Testing Checklist

Before deploying, confirm all these work:

- [ ] ✅ Application builds without errors (`npm run build`)
- [ ] ✅ Development server starts (`npm run dev`)
- [ ] ✅ Homepage loads (http://localhost:3000)
- [ ] ✅ Can create new account (signup works)
- [ ] ✅ Can login with created account
- [ ] ✅ Essay submission form displays
- [ ] ✅ Can submit essay for scoring
- [ ] ✅ Scoring completes in < 30 seconds
- [ ] ✅ Results show all 4 criteria scores
- [ ] ✅ Feedback displays correctly
- [ ] ✅ Dashboard shows submitted essays
- [ ] ✅ Can view essay details
- [ ] ✅ Profile page works
- [ ] ✅ Can update profile
- [ ] ✅ Logout works
- [ ] ✅ Protected routes redirect to login
- [ ] ✅ Can login again after logout
- [ ] ✅ No console errors (red)
- [ ] ✅ Database stores data correctly
- [ ] ✅ Prisma Studio shows all tables

---

## 🐛 Common Issues & Solutions

### Issue: npm install fails

**Solution:**

```powershell
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### Issue: "Module not found" errors

**Solution:**

```powershell
# Reinstall dependencies
npm install
npx prisma generate
```

### Issue: Database errors

**Solution:**

```powershell
# Reset database (WARNING: deletes data)
rm prisma/dev.db
npx prisma migrate dev --name init
```

### Issue: Port 3000 already in use

**Solution:**

```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or use different port
$env:PORT=3001
npm run dev
```

### Issue: Groq API not working

**Solution:**

1. Check API key is correct in `.env.local`
2. Verify key works: Go to https://console.groq.com
3. Try regenerating key
4. Check Groq service status

### Issue: NextAuth errors

**Solution:**

```powershell
# Regenerate secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Update NEXTAUTH_SECRET in .env.local
# Restart server: Ctrl+C, then npm run dev
```

### Issue: "Prisma Client not generated"

**Solution:**

```powershell
npx prisma generate
npm run dev
```

---

## 🎯 Performance Benchmarks

**Your local testing should meet these metrics:**

| Metric         | Expected      | Actual | Status |
| -------------- | ------------- | ------ | ------ |
| Build time     | < 60 seconds  | ?      | ☐      |
| Page load      | < 2 seconds   | ?      | ☐      |
| Essay scoring  | 15-30 seconds | ?      | ☐      |
| Database query | < 100ms       | ?      | ☐      |
| API response   | < 500ms       | ?      | ☐      |

---

## 📊 Test Results Summary

After completing all tests, document your results:

### ✅ Working Features:

- [ ] List everything that works

### ❌ Issues Found:

- [ ] List any problems discovered

### ⚠️ Warnings/Concerns:

- [ ] Note any warnings or concerns

---

## Next Steps

### If Everything Works ✅

**Congratulations!** Your application is ready for deployment.

**Next:** Follow `DEPLOYMENT_GUIDE_DETAILED.md` to deploy to production.

### If Issues Found ❌

**Fix issues first before deploying:**

1. Document all errors
2. Check troubleshooting section above
3. Search error messages online
4. Fix one issue at a time
5. Re-test after each fix
6. Once all tests pass ✅, proceed to deployment

---

## 💡 Testing Tips

1. **Test in different browsers:**

   - Chrome
   - Firefox
   - Edge

2. **Test with different essays:**

   - Short essay (150 words)
   - Long essay (400 words)
   - Essay with many errors
   - Essay with few errors

3. **Test edge cases:**

   - Very short essay (< 100 words)
   - Non-English text
   - Empty fields

4. **Monitor performance:**
   - Check response times
   - Note any slowness
   - Verify scoring accuracy

---

## 🔄 Continuous Testing

Make this a habit:

```powershell
# Quick test routine (run before every deployment)
npm run build              # Ensure it builds
npm run dev                # Start server
# Test signup, login, scoring
# Check for console errors
# Review server logs
```

---

## 📝 Test Report Template

Document your testing:

```
Testing Date: [DATE]
Tester: [YOUR NAME]
Environment: Local Development

Build Status: ✅ / ❌
Tests Passed: X/20
Tests Failed: X/20

Critical Issues: [NONE / LIST]
Minor Issues: [NONE / LIST]

Ready for Deployment: YES / NO

Notes:
[Any additional observations]
```

---

## ✅ Final Verification

**Before moving to deployment, confirm:**

- [ ] All 20 checklist items pass ✅
- [ ] No critical errors
- [ ] All features work as expected
- [ ] Performance is acceptable
- [ ] Database stores data correctly
- [ ] No security warnings
- [ ] Code is committed to Git

---

**Once everything passes, you're ready to deploy! 🚀**

Proceed to: `DEPLOYMENT_GUIDE_DETAILED.md`

---

**Questions?**

- Review error messages carefully
- Check the troubleshooting section
- Test each component individually
- Verify environment variables are set correctly
