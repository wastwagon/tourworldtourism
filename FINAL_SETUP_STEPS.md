# 🎯 Final Setup Steps - Your Application is Created!

## ✅ What's Done

- ✅ Database: Running
- ✅ GitHub: Connected
- ✅ Application: Created (`wastwagon/tourworldtourism:main-18okcw...`)

---

## 🔧 Step 1: Configure Your Application

**Click on your application card** (the one showing `wastwagon/tourworldtourism:main-18okcw...`)

### 1a. Add Environment Variables

1. Click on your application
2. Go to **"Environment Variables"** tab (left sidebar)
3. Click **"+ Add"** for each variable:

   **Variable 1:**
   - Name: `NODE_ENV`
   - Value: `production`
   - Click **"Add"**

   **Variable 2:**
   - Name: `DATABASE_URL`
   - Value: `postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism`
   - Click **"Add"**

   **Variable 3:**
   - Name: `NEXTAUTH_SECRET`
   - Value: `Is3YLDBl8Bw7PlBQQQyHmW8/BWZaW4DhKsMyT/xwMJA=`
   - Click **"Add"**

   **Variable 4:**
   - Name: `NEXTAUTH_URL`
   - Value: `http://31.97.57.75:3000`
   - Click **"Add"**

   **Variable 5:**
   - Name: `PORT`
   - Value: `3000`
   - Click **"Add"**

### 1b. Link Database

1. Still in your application settings
2. Go to **"Service Connections"** or **"Dependencies"** tab
3. Click **"+ Add"** or **"Link Service"**
4. Select: `postgresql-database-jc48w0kggo0s88sog4s8008c` (your database)
5. Click **"Add"** or **"Link"**

### 1c. Check Port Configuration

1. Go to **"Configuration"** or **"General"** tab
2. Make sure **Port** is set to `3000`
3. Save if needed

---

## 🚀 Step 2: Deploy Your Application

1. After adding all environment variables and linking the database
2. Go to the main application page
3. Click the big **"Deploy"** or **"Start"** button
4. **Wait 5-10 minutes** - watch the logs!

**What you'll see:**
- Installing dependencies...
- Generating Prisma client...
- Building Next.js app...
- Starting server...
- **"Ready"** or **"Deployed"** ✅

---

## ✅ Step 3: Test Your Website

After deployment completes:

1. **Visit your website:**
   - `http://31.97.57.75:3000` OR
   - The URL shown in your application: `http://acwo080800s4w4s8w4s0wko4.31.97.57.75.s...`

2. **You should see:** Your Tourworld Tourism homepage! 🎉

3. **If there are errors:**
   - Check **"Logs"** tab in your application
   - Look for red error messages
   - Share them with me and I'll help fix!

---

## 👤 Step 4: Create Admin User

After your website is running:

1. In Coolify → Your Application → **"Terminal"** tab
2. Run this command:
   ```bash
   node scripts/create-admin.js
   ```
3. Follow prompts:
   - Email: `admin@tourworldtourism.com` (or your email)
   - Password: Create a strong password
   - Confirm password

4. **Test admin login:**
   - Visit: `http://31.97.57.75:3000/admin/login`
   - Log in with your admin credentials

---

## 📋 Quick Checklist

- [ ] Click on your application
- [ ] Add 5 environment variables
- [ ] Link database to application
- [ ] Check port is 3000
- [ ] Click "Deploy"
- [ ] Wait for deployment (5-10 min)
- [ ] Visit website: `http://31.97.57.75:3000`
- [ ] Create admin user
- [ ] Test admin login

---

## 🎉 You're Almost There!

Your application is created - just need to:
1. Add environment variables (5 minutes)
2. Link database (1 minute)
3. Deploy (5-10 minutes)
4. Done! 🚀

---

## 🆘 Need Help?

If you get stuck:
1. Tell me which step you're on
2. Share any error messages
3. I'll help you fix it!

**You're doing great! Almost done! 💪**

