# 🚀 Coolify Quick Start Guide

## ⚡ Quick Deployment Steps

### 1. Push to GitHub (Do this first!)

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for Coolify deployment"
git push origin main
```

---

### 2. In Coolify Dashboard (`http://31.97.57.75:8000`)

#### A. Create PostgreSQL Database

1. Click **"Destinations"** → **"+ Add"**
2. Select **"PostgreSQL"**
3. Fill in:
   - Name: `tourworld-tourism-db`
   - Database: `tourworld_tourism`
   - User: `tourworld_user`
   - Password: `[CREATE STRONG PASSWORD]` ⚠️ **SAVE THIS!**
4. Click **"Create"**
5. **Copy the connection string** - you'll need it!

#### B. Create Application

1. Click **"Projects"** → **"+ Add"** → **"New Project"**
2. Name: `tourworld-tourism`
3. Click **"Create"**

4. Inside project → **"+ Add"** → **"New Resource"** → **"Application"**
5. Source: **"GitHub"**
6. Repository: `wastwagon/tourworldtourism`
7. Branch: `main`
8. Click **"Next"**

#### C. Configure Application

**Build Settings:**
- Build Pack: **"Dockerfile"** (Coolify will auto-detect)
- Port: `3000`

**Environment Variables** (Click "Environment Variables"):
```
NODE_ENV=production
DATABASE_URL=[PASTE CONNECTION STRING FROM DATABASE]
NEXTAUTH_SECRET=[GENERATE WITH: openssl rand -base64 32]
NEXTAUTH_URL=http://31.97.57.75:3000
PORT=3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

#### D. Link Database

1. In application settings, find **"Service Connections"** or **"Dependencies"**
2. Add: `tourworld-tourism-db`
3. This auto-configures the connection

#### E. Deploy!

1. Click **"Deploy"** or **"Save & Deploy"**
2. Watch build logs
3. Wait 5-10 minutes for first deployment

---

### 3. After Deployment

**Access your app:**
- `http://31.97.57.75:3000` (or your configured domain)

**Create admin user:**
1. In Coolify → Your Application → **"Terminal"** or **"SSH"**
2. Run:
   ```bash
   node scripts/create-admin.js
   ```

**Verify:**
- Visit: `http://31.97.57.75:3000`
- Login: `http://31.97.57.75:3000/admin/login`

---

## 🔧 Common Issues & Fixes

### Database Connection Error

**Problem:** Can't connect to database

**Solution:**
1. Check database is running (Destinations → your database)
2. Verify `DATABASE_URL` format matches Coolify's connection string
3. Ensure database name, user, password are correct

### Build Fails

**Problem:** Build command fails

**Solution:**
- Check build logs in Coolify
- Verify `DATABASE_URL` is set (even if placeholder during build)
- Ensure Dockerfile exists (✅ we created it)

### Port Already in Use

**Problem:** Port 3000 is taken

**Solution:**
- Change port in application settings
- Update `PORT` environment variable
- Update `NEXTAUTH_URL` to match new port

---

## 📝 Environment Variables Checklist

Before deploying, ensure these are set:

- ✅ `NODE_ENV=production`
- ✅ `DATABASE_URL=[from Coolify database]`
- ✅ `NEXTAUTH_SECRET=[generated secret]`
- ✅ `NEXTAUTH_URL=[your app URL]`
- ✅ `PORT=3000`

---

## 🎯 Your Setup Info

- **VPS IP**: `31.97.57.75`
- **Coolify**: `http://31.97.57.75:8000`
- **GitHub**: `wastwagon/tourworldtourism`
- **Branch**: `main`

---

## 📚 Full Guide

For detailed instructions, see: `COOLIFY_DEPLOYMENT_GUIDE.md`

---

**Ready? Start with Step 1 - Push to GitHub!** 🚀

