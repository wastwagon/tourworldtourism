# 🎯 Coolify Step-by-Step Deployment Guide

## ✅ Status Check

**Coolify is accessible:** ✅ `http://31.97.57.75:8000` is responding
**GitHub Repository:** ✅ `wastwagon/tourworldtourism` 
**All Code Committed:** ✅ Ready to push

---

## 📋 Complete Deployment Process

### PART 1: Push to GitHub (Do This First!)

**In GitHub Desktop:**
1. Click **"Push origin"** button (top right)
2. Wait for push to complete
3. Verify: Go to https://github.com/wastwagon/tourworldtourism - all files should be there

---

### PART 2: Login to Coolify

1. Open browser: `http://31.97.57.75:8000`
2. You'll be redirected to `/login`
3. Enter your Coolify credentials
4. You'll see the dashboard

---

### PART 3: Create PostgreSQL Database

**Step 1: Navigate to Destinations**
- Click **"Destinations"** in the left sidebar (map pin icon)

**Step 2: Add PostgreSQL**
- Click **"+ Add"** button (top right)
- Select **"PostgreSQL"** from the list

**Step 3: Configure Database**
Fill in the form:
```
Name: tourworld-tourism-db
Version: 16 (or latest available)
Database Name: tourworld_tourism
Database User: tourworld_user
Database Password: [CREATE A STRONG PASSWORD - WRITE IT DOWN!]
```

**Step 4: Create**
- Click **"Create"** or **"Save"**
- Wait 1-2 minutes for database to be created
- **IMPORTANT:** Copy the connection string/URL shown - it looks like:
  ```
  postgresql://tourworld_user:password@host:5432/tourworld_tourism
  ```

---

### PART 4: Connect GitHub Repository

**Step 1: Go to Sources**
- Click **"Sources"** in the left sidebar (folder icon)

**Step 2: Add GitHub Source**
- Click **"+ Add"** button
- Select **"GitHub"**
- If first time: Authorize Coolify to access your GitHub
- Select repository: `wastwagon/tourworldtourism`
- Branch: `main`
- Click **"Add"** or **"Save"**

---

### PART 5: Create Project

**Step 1: Create Project**
- Click **"Projects"** in the left sidebar (stack icon)
- Click **"+ Add"** → **"New Project"**
- Name: `tourworld-tourism`
- Click **"Create"**

**Step 2: Create Application**
- Inside your project, click **"+ Add"** → **"New Resource"**
- Select **"Application"**

**Step 3: Configure Source**
- Source Type: **"GitHub"**
- Repository: Select `wastwagon/tourworldtourism`
- Branch: `main`
- Click **"Next"** or **"Continue"**

---

### PART 6: Configure Application Settings

**Build Configuration:**
- **Build Pack:** Select **"Dockerfile"** (Coolify should auto-detect it)
- **Build Command:** (Leave default or use):
  ```
  npm install && npx prisma generate && npx prisma db push --accept-data-loss && npm run build
  ```
- **Start Command:** `npm start`
- **Port:** `3000`

**Environment Variables:**
Click **"Environment Variables"** or **"Env"** tab and add:

```env
NODE_ENV=production
DATABASE_URL=postgresql://tourworld_user:YOUR_PASSWORD@tourworld-tourism-db:5432/tourworld_tourism
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://31.97.57.75:3000
PORT=3000
```

**Generate NEXTAUTH_SECRET:**
Run this in your terminal:
```bash
openssl rand -base64 32
```
Copy the output and paste it as `NEXTAUTH_SECRET` value.

**Important Notes:**
- Replace `YOUR_PASSWORD` with the database password you created
- Replace `your_generated_secret_here` with the generated secret
- The `DATABASE_URL` format might be different - check what Coolify shows for your database connection

---

### PART 7: Link Database to Application

**In Application Settings:**
1. Look for **"Service Connections"**, **"Dependencies"**, or **"Linked Services"**
2. Click **"+ Add"** or **"Link Service"**
3. Select: `tourworld-tourism-db` (your PostgreSQL database)
4. This will automatically configure the connection

**Alternative:** If Coolify uses environment variables automatically:
- The database connection might be auto-set
- Check if `DATABASE_URL` is already populated
- If not, manually set it using the connection string from Part 3

---

### PART 8: Configure Domain/Port

**Option A: Use IP Address (For Testing)**
- Go to **"Ports"** or **"Networking"** section
- Public Port: `3000` (or any available port)
- Your app will be at: `http://31.97.57.75:3000`

**Option B: Use Domain (Recommended)**
- Go to **"Domains"** section
- Add your domain: `yourdomain.com`
- Configure DNS: Point A record to `31.97.57.75`
- Coolify will handle SSL automatically

---

### PART 9: Deploy!

1. **Review Settings:**
   - ✅ Build pack: Dockerfile
   - ✅ Environment variables set
   - ✅ Database linked
   - ✅ Port configured

2. **Deploy:**
   - Click **"Deploy"**, **"Save & Deploy"**, or **"Start Deployment"**
   - Watch the build logs in real-time
   - First deployment takes 5-10 minutes

3. **Monitor Build:**
   - You'll see logs like:
     - Installing dependencies
     - Generating Prisma client
     - Building Next.js app
     - Starting server

---

### PART 10: Post-Deployment

**Verify Application:**
- Visit: `http://31.97.57.75:3000` (or your domain)
- You should see your homepage!

**Check Logs:**
- In Coolify → Your Application → **"Logs"**
- Look for any errors
- Should see: "Ready" or "Server started"

**Create Admin User:**
1. In Coolify → Your Application → **"Terminal"** or **"Execute Command"**
2. Run:
   ```bash
   node scripts/create-admin.js
   ```
3. Follow prompts to create admin account

**Test:**
- Homepage: `http://31.97.57.75:3000`
- Admin Login: `http://31.97.57.75:3000/admin/login`

---

## 🔧 Troubleshooting

### Database Connection Issues

**Problem:** Application can't connect to database

**Solution:**
1. Verify database is running (Destinations → your database → should show "Running")
2. Check `DATABASE_URL` format matches Coolify's connection string
3. In Coolify, database connection string might be:
   - `postgresql://tourworld_user:password@tourworld-tourism-db:5432/tourworld_tourism`
   - Or separate variables: `POSTGRES_HOST`, `POSTGRES_USER`, etc.

**If using separate variables, update DATABASE_URL:**
```env
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DATABASE}
```

### Build Fails

**Problem:** Build process fails

**Check:**
1. Build logs in Coolify (Application → Logs)
2. Common issues:
   - Missing `DATABASE_URL` (even placeholder works during build)
   - Prisma client generation fails
   - Node modules installation fails

**Solution:**
- Ensure `DATABASE_URL` is set (can be placeholder during build)
- Verify Dockerfile exists ✅
- Check build command includes `npx prisma generate`

### Application Won't Start

**Problem:** App builds but won't start

**Check Logs:**
- Application → Logs → Look for errors
- Common issues:
  - Port already in use
  - Missing environment variables
  - Database connection timeout

**Solution:**
- Change port if conflict
- Verify all environment variables are set
- Check database is accessible

---

## 📝 Environment Variables Checklist

Before deploying, ensure these are set in Coolify:

- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL=[from database connection string]`
- [ ] `NEXTAUTH_SECRET=[generated secret]`
- [ ] `NEXTAUTH_URL=http://31.97.57.75:3000` (or your domain)
- [ ] `PORT=3000`

---

## 🎯 Quick Reference

**Your Setup:**
- **VPS IP**: `31.97.57.75`
- **Coolify**: `http://31.97.57.75:8000`
- **GitHub**: `wastwagon/tourworldtourism`
- **Branch**: `main`
- **App URL**: `http://31.97.57.75:3000` (after deployment)

**Files Created:**
- ✅ `Dockerfile` - For containerization
- ✅ `.dockerignore` - Optimize build
- ✅ `next.config.ts` - Standalone output enabled
- ✅ All deployment guides

---

## ✅ Deployment Checklist

- [ ] Pushed all code to GitHub
- [ ] Logged into Coolify
- [ ] Created PostgreSQL database
- [ ] Connected GitHub repository
- [ ] Created project and application
- [ ] Configured build settings
- [ ] Set all environment variables
- [ ] Linked database to application
- [ ] Configured port/domain
- [ ] Deployed application
- [ ] Verified application is running
- [ ] Created admin user
- [ ] Tested homepage and admin panel

---

## 🚀 You're Ready!

Start with **PART 1** - Push to GitHub, then follow Parts 2-10 in Coolify.

If you get stuck at any step, check the logs in Coolify or let me know which step you're on!

