# 🎯 Complete Beginner's Guide: Deploy Your Tourism Website

## 📚 What We're Doing

We're going to deploy your **Tourworld Tourism** website to your VPS server using Coolify. Think of it like this:

- **Your VPS** = Your computer/server in the cloud
- **Coolify** = A tool that helps deploy websites easily
- **GitHub** = Where your code is stored
- **PostgreSQL** = Your database (where all your tours, hotels, blogs are stored)

---

## ✅ Step-by-Step Process

### **STEP 1: Push Code to GitHub** ✅ (Already Done!)

Your code is ready to push. In GitHub Desktop:
- Click **"Push origin"** button
- Wait for it to complete
- Done! ✅

---

### **STEP 2: Create Database in Coolify**

**What is this?** Your website needs a database to store tours, hotels, blogs, galleries, etc.

**How to do it:**

1. In Coolify, you should be on the **Resources** page (if not, click "Project" → "tourworld-tourism")
2. Look for a **search box** at the top that says "Search resources, paths, everything (type new for create)..."
3. Click in that box and type: `new postgresql`
4. You'll see options appear - click on **"PostgreSQL"** or **"New PostgreSQL"**
5. Fill in the form:
   ```
   Name: tourworld-tourism-db
   Database Name: tourworld_tourism
   Database User: tourworld_user
   Database Password: [Create a strong password - WRITE IT DOWN!]
   ```
6. Click **"Create"** or **"Continue"**
7. Wait 1-2 minutes for it to be created
8. **IMPORTANT:** Copy the connection string shown (looks like: `postgresql://user:password@host:5432/database`)
   - Save this somewhere safe - you'll need it!

**✅ Checkpoint:** Database created? Great! Move to Step 3.

---

### **STEP 3: Connect GitHub to Coolify**

**What is this?** Coolify needs to know where your code is.

**How to do it:**

1. Click **"Sources"** in the left sidebar (folder icon)
2. Click **"+ Add"** button (top right)
3. Select **"GitHub"**
4. If first time:
   - Click **"Authorize"** or **"Connect GitHub"**
   - Log in to GitHub if asked
   - Allow Coolify to access your repositories
5. Select your repository: `wastwagon/tourworldtourism`
6. Branch: `main`
7. Click **"Add"** or **"Save"**

**✅ Checkpoint:** GitHub connected? Great! Move to Step 4.

---

### **STEP 4: Create Your Website Application**

**What is this?** This is your actual website that visitors will see.

**How to do it:**

1. Go back to your project: Click **"Project"** → **"tourworld-tourism"**
2. You should see **"Resources"** page
3. Click in the search box (top right) and type: `new application`
4. Select **"Application"** from the options
5. **Source Configuration:**
   - Source Type: **"GitHub"**
   - Repository: Select `wastwagon/tourworldtourism`
   - Branch: `main`
   - Click **"Next"** or **"Continue"**

6. **Build Configuration:**
   - Build Pack: Select **"Dockerfile"** (Coolify should auto-detect it)
   - Port: `3000` (this is where your website will run)
   - Click **"Next"** or **"Continue"**

7. **Application Settings:**
   - Name: `tourworld-tourism` (or leave default)
   - Click **"Next"** or **"Continue"**

**✅ Checkpoint:** Application created? Great! Move to Step 5.

---

### **STEP 5: Set Environment Variables**

**What is this?** These are settings your website needs to work properly.

**How to do it:**

1. In your application settings, find **"Environment Variables"** or **"Env"** tab
2. Click **"+ Add"** or **"Add Variable"** for each one:

   **Variable 1:**
   - Name: `NODE_ENV`
   - Value: `production`
   - Click **"Add"**

   **Variable 2:**
   - Name: `DATABASE_URL`
   - Value: [Paste the connection string from Step 2]
   - Click **"Add"**

   **Variable 3:**
   - Name: `NEXTAUTH_SECRET`
   - Value: [Generate this - see below]
   - Click **"Add"**

   **Variable 4:**
   - Name: `NEXTAUTH_URL`
   - Value: `http://31.97.57.75:3000`
   - Click **"Add"**

   **Variable 5:**
   - Name: `PORT`
   - Value: `3000`
   - Click **"Add"**

**How to generate NEXTAUTH_SECRET:**

Open Terminal on your Mac and run:
```bash
openssl rand -base64 32
```

Copy the output (it's a long random string) and paste it as the value for `NEXTAUTH_SECRET`.

**✅ Checkpoint:** All 5 variables added? Great! Move to Step 6.

---

### **STEP 6: Link Database to Application**

**What is this?** Connect your database to your website.

**How to do it:**

1. In your application settings, look for:
   - **"Service Connections"** OR
   - **"Dependencies"** OR
   - **"Linked Services"**
2. Click **"+ Add"** or **"Link Service"**
3. Select: `tourworld-tourism-db` (the database you created)
4. Click **"Add"** or **"Link"**

**✅ Checkpoint:** Database linked? Great! Move to Step 7.

---

### **STEP 7: Configure Port/Domain**

**What is this?** Set up how people will access your website.

**For now (testing with IP):**

1. In application settings, find **"Ports"** or **"Networking"**
2. Set Public Port: `3000`
3. Your website will be at: `http://31.97.57.75:3000`

**Later (when you have domain):**

1. In application settings, find **"Domains"**
2. Add your domain: `yourdomain.com`
3. Configure DNS: Point A record to `31.97.57.75`
4. Coolify will handle SSL automatically

**✅ Checkpoint:** Port configured? Great! Move to Step 8.

---

### **STEP 8: Deploy Your Website!**

**What is this?** This builds and starts your website.

**How to do it:**

1. Review all settings one more time
2. Click **"Deploy"** or **"Save & Deploy"** button
3. Watch the build logs - you'll see:
   - Installing dependencies
   - Generating Prisma client
   - Building Next.js app
   - Starting server
4. **First deployment takes 5-10 minutes** - be patient!
5. When you see "Ready" or "Deployed" - you're done! 🎉

**✅ Checkpoint:** Deployment started? Great! Wait for it to finish.

---

### **STEP 9: Verify Everything Works**

**After deployment completes:**

1. **Check your website:**
   - Open browser: `http://31.97.57.75:3000`
   - You should see your homepage!

2. **Check logs (if there are errors):**
   - In Coolify → Your Application → **"Logs"**
   - Look for any red error messages

3. **Create admin user:**
   - In Coolify → Your Application → **"Terminal"** or **"Execute Command"**
   - Run: `node scripts/create-admin.js`
   - Follow prompts to create admin account

4. **Test admin login:**
   - Visit: `http://31.97.57.75:3000/admin/login`
   - Log in with your admin credentials

**✅ Checkpoint:** Website working? Congratulations! 🎉

---

## 🔧 Troubleshooting

### Problem: Build fails

**Solution:**
- Check logs in Coolify (Application → Logs)
- Make sure `DATABASE_URL` is set correctly
- Verify Dockerfile exists (it does ✅)

### Problem: Can't connect to database

**Solution:**
- Verify database is running (Destinations → your database)
- Check `DATABASE_URL` format matches Coolify's connection string
- Ensure database is linked to application

### Problem: Website won't start

**Solution:**
- Check application logs
- Verify all environment variables are set
- Check port is available (try changing to 3001 if 3000 is taken)

---

## 📝 Quick Reference

**Your Setup:**
- VPS IP: `31.97.57.75`
- Coolify: `http://31.97.57.75:8000`
- GitHub: `wastwagon/tourworldtourism`
- Website: `http://31.97.57.75:3000` (after deployment)

**Environment Variables Needed:**
1. `NODE_ENV=production`
2. `DATABASE_URL=[from database]`
3. `NEXTAUTH_SECRET=[generated secret]`
4. `NEXTAUTH_URL=http://31.97.57.75:3000`
5. `PORT=3000`

---

## 🎯 What to Do Right Now

1. **First:** Push your code to GitHub (GitHub Desktop → Push origin)
2. **Then:** Follow Steps 2-8 above in Coolify
3. **Finally:** Test your website!

---

## 💡 Tips for Beginners

- **Take your time** - Don't rush, read each step carefully
- **Write things down** - Save passwords and connection strings
- **Check checkpoints** - Make sure each step works before moving on
- **Read error messages** - They usually tell you what's wrong
- **Ask for help** - If stuck, let me know which step you're on!

---

## 🆘 Need Help?

If you get stuck:
1. Tell me which step you're on
2. Share any error messages you see
3. I'll help you fix it!

**You've got this! Let's get your website online! 🚀**

