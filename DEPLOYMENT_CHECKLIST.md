# ✅ Deployment Checklist for Coolify

## 🎯 Pre-Deployment Checklist

### Code Ready
- [x] All code committed
- [x] Dockerfile created
- [x] .dockerignore configured
- [x] next.config.ts updated for standalone output
- [x] Environment variables documented

### GitHub Ready
- [x] Repository: `wastwagon/tourworldtourism`
- [x] Branch: `main`
- [ ] **TODO: Push all commits to GitHub**

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub ⚠️ **DO THIS FIRST!**

```bash
git push origin main
```

**Verify:** Go to https://github.com/wastwagon/tourworldtourism and check all files are there.

---

### Step 2: Create Database in Coolify

1. Open Coolify: `http://31.97.57.75:8000`
2. Go to **"Destinations"** → **"+ Add"**
3. Select **"PostgreSQL"**
4. Configure:
   ```
   Name: tourworld-tourism-db
   Database: tourworld_tourism
   User: tourworld_user
   Password: [CREATE STRONG PASSWORD - SAVE IT!]
   ```
5. Click **"Create"**
6. **Copy the connection string** - you'll need it!

---

### Step 3: Create Application

1. Go to **"Projects"** → **"+ Add"** → **"New Project"**
2. Name: `tourworld-tourism`
3. Click **"Create"**

4. Inside project → **"+ Add"** → **"New Resource"** → **"Application"**
5. Source: **"GitHub"**
6. Authorize GitHub (if first time)
7. Repository: `wastwagon/tourworldtourism`
8. Branch: `main`
9. Click **"Next"**

---

### Step 4: Configure Application

**Build Settings:**
- Build Pack: **"Dockerfile"** (auto-detected)
- Port: `3000`

**Environment Variables:**
Click **"Environment Variables"** and add:

```env
NODE_ENV=production
DATABASE_URL=[PASTE FROM STEP 2]
NEXTAUTH_SECRET=[GENERATE BELOW]
NEXTAUTH_URL=http://31.97.57.75:3000
PORT=3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Link Database:**
- Find **"Service Connections"** or **"Dependencies"**
- Add: `tourworld-tourism-db`

---

### Step 5: Deploy

1. Review all settings
2. Click **"Deploy"** or **"Save & Deploy"**
3. Watch build logs
4. Wait 5-10 minutes

---

### Step 6: Post-Deployment

**Verify Application:**
- Visit: `http://31.97.57.75:3000`
- Should see your homepage!

**Create Admin User:**
1. In Coolify → Your App → **"Terminal"**
2. Run:
   ```bash
   node scripts/create-admin.js
   ```

**Test:**
- Homepage: `http://31.97.57.75:3000`
- Admin: `http://31.97.57.75:3000/admin/login`

---

## 🔍 Troubleshooting

### Build Fails
- Check logs in Coolify
- Verify `DATABASE_URL` is set
- Ensure Dockerfile exists ✅

### Database Connection Error
- Verify database is running
- Check `DATABASE_URL` format
- Ensure database is linked to application

### Application Won't Start
- Check application logs
- Verify all environment variables
- Check port is available

---

## 📝 Quick Reference

**Your Info:**
- VPS: `31.97.57.75`
- Coolify: `http://31.97.57.75:8000`
- GitHub: `wastwagon/tourworldtourism`
- App URL: `http://31.97.57.75:3000`

**Guides:**
- Quick Start: `COOLIFY_QUICK_START.md`
- Full Guide: `COOLIFY_DEPLOYMENT_GUIDE.md`

---

## ✅ Ready to Deploy!

1. **Push to GitHub** (most important!)
2. Follow steps 2-6 above
3. Your app will be live! 🎉

