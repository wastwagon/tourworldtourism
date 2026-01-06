# 🎯 Simple Setup Steps - Follow These Exactly

## ✅ STEP 1: Push to GitHub (Do This First!)

1. Open **GitHub Desktop**
2. Click the **"Push origin"** button (top right, blue button)
3. Wait until it says "Pushed successfully"
4. ✅ Done!

---

## ✅ STEP 2: Create Database

**Where:** Coolify → Your Project → Resources Page

**What to do:**

1. Look at the **top right** of the screen
2. Find the search box that says: **"Search resources, paths, everything (type new for create)..."**
3. **Click** in that box
4. **Type:** `postgresql` (or `new postgresql`)
5. You'll see options appear - **click** on **"PostgreSQL"** or **"New PostgreSQL Database"**

6. Fill in the form that appears:
   - **Name:** `tourworld-tourism-db`
   - **Database Name:** `tourworld_tourism`
   - **Database User:** `tourworld_user`
   - **Database Password:** Create a password (like: `TourWorld2025!Secure`)
     - ⚠️ **WRITE THIS DOWN!** You'll need it later!

7. Click **"Create"** or **"Continue"**
8. Wait 1-2 minutes
9. **IMPORTANT:** After it's created, you'll see a connection string - **COPY IT** and save it!
   - It looks like: `postgresql://tourworld_user:password@host:5432/tourworld_tourism`

✅ **Checkpoint:** Database created? Great! Move to Step 3.

---

## ✅ STEP 3: Connect GitHub

**Where:** Coolify → Left Sidebar → "Sources"

**What to do:**

1. Click **"Sources"** in the left sidebar (looks like a folder icon)
2. Click the **"+ Add"** button (top right)
3. Click **"GitHub"**
4. If it's your first time:
   - Click **"Authorize"** or **"Connect"**
   - Log in to GitHub if asked
   - Click **"Authorize Coolify"**
5. Find your repository: `wastwagon/tourworldtourism`
6. Select **Branch:** `main`
7. Click **"Add"** or **"Save"**

✅ **Checkpoint:** GitHub connected? Great! Move to Step 4.

---

## ✅ STEP 4: Create Your Website

**Where:** Coolify → Your Project → Resources Page

**What to do:**

1. Go back to your project (click **"Project"** → **"tourworld-tourism"**)
2. You should see the **Resources** page
3. Click in the **search box** (top right)
4. **Type:** `application` (or `new application`)
5. Click on **"Application"** from the options

6. **Step 4a - Source:**
   - Source Type: Select **"GitHub"**
   - Repository: Select `wastwagon/tourworldtourism`
   - Branch: `main`
   - Click **"Next"**

7. **Step 4b - Build:**
   - Build Pack: Select **"Dockerfile"** (should be auto-detected)
   - Port: `3000`
   - Click **"Next"**

8. **Step 4c - Name:**
   - Name: `tourworld-tourism` (or leave default)
   - Click **"Create"** or **"Continue"**

✅ **Checkpoint:** Application created? Great! Move to Step 5.

---

## ✅ STEP 5: Add Environment Variables

**Where:** Your Application → Settings → Environment Variables

**What to do:**

1. Click on your application (the one you just created)
2. Look for **"Environment Variables"** or **"Env"** tab
3. Click **"+ Add Variable"** or **"Add"** for each one:

   **Variable 1:**
   ```
   Name: NODE_ENV
   Value: production
   ```

   **Variable 2:**
   ```
   Name: DATABASE_URL
   Value: [Paste the connection string from Step 2]
   ```

   **Variable 3:**
   ```
   Name: NEXTAUTH_SECRET
   Value: [See below - generate this]
   ```

   **Variable 4:**
   ```
   Name: NEXTAUTH_URL
   Value: http://31.97.57.75:3000
   ```

   **Variable 5:**
   ```
   Name: PORT
   Value: 3000
   ```

**How to generate NEXTAUTH_SECRET:**

1. Open **Terminal** on your Mac (Applications → Utilities → Terminal)
2. Type this command and press Enter:
   ```bash
   openssl rand -base64 32
   ```
3. Copy the long string that appears
4. Paste it as the value for `NEXTAUTH_SECRET`

✅ **Checkpoint:** All 5 variables added? Great! Move to Step 6.

---

## ✅ STEP 6: Link Database

**Where:** Your Application → Settings → Service Connections

**What to do:**

1. In your application settings, look for:
   - **"Service Connections"** OR
   - **"Dependencies"** OR
   - **"Linked Services"**
2. Click **"+ Add"** or **"Link Service"**
3. Select: `tourworld-tourism-db` (the database you created)
4. Click **"Add"** or **"Link"**

✅ **Checkpoint:** Database linked? Great! Move to Step 7.

---

## ✅ STEP 7: Set Port

**Where:** Your Application → Settings → Ports

**What to do:**

1. In your application settings, find **"Ports"** or **"Networking"**
2. Set **Public Port:** `3000`
3. Save

✅ **Checkpoint:** Port set? Great! Move to Step 8.

---

## ✅ STEP 8: Deploy!

**Where:** Your Application → Deploy Button

**What to do:**

1. Review everything one more time
2. Click the big **"Deploy"** or **"Save & Deploy"** button
3. **Wait 5-10 minutes** - watch the logs!
4. You'll see:
   - Installing packages...
   - Building...
   - Starting...
5. When you see **"Ready"** or **"Deployed"** - you're done! 🎉

✅ **Checkpoint:** Deployment complete? Great! Move to Step 9.

---

## ✅ STEP 9: Test Your Website

**What to do:**

1. Open your browser
2. Go to: `http://31.97.57.75:3000`
3. You should see your **Tourworld Tourism** homepage! 🎉

**If it works:**
- ✅ Your website is live!
- Next: Create admin user (see below)

**If it doesn't work:**
- Check logs in Coolify (Application → Logs)
- Look for error messages
- Let me know what error you see!

---

## ✅ STEP 10: Create Admin User

**Where:** Coolify → Your Application → Terminal

**What to do:**

1. In Coolify, go to your application
2. Find **"Terminal"** or **"Execute Command"** tab
3. Click on it
4. Type this command:
   ```bash
   node scripts/create-admin.js
   ```
5. Press Enter
6. Follow the prompts:
   - Enter email: `admin@tourworldtourism.com` (or your email)
   - Enter password: Create a strong password
   - Confirm password: Type it again
7. ✅ Admin user created!

**Test admin login:**
- Go to: `http://31.97.57.75:3000/admin/login`
- Log in with your admin credentials

---

## 🎉 Congratulations!

Your website is now live! 

**Your website:** `http://31.97.57.75:3000`

**Later, when you have a domain:**
1. In Coolify → Your Application → Domains
2. Add your domain
3. Configure DNS to point to `31.97.57.75`
4. Coolify will add SSL automatically

---

## 🆘 Need Help?

**If you get stuck:**
1. Tell me which **STEP** you're on (1-10)
2. Tell me what you see on your screen
3. Share any error messages
4. I'll help you fix it!

**You can do this! Take it one step at a time! 🚀**

