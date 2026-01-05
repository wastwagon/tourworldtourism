# 🚀 Coolify Deployment Guide for Tourworld Tourism

## 📋 Prerequisites

✅ **Completed:**
- Coolify installed on your Hostinger VPS
- GitHub repository ready
- Application code complete
- Database schema ready

## 🎯 Step-by-Step Deployment

### Step 1: Push Everything to GitHub

First, make sure all your code is pushed to GitHub:

```bash
# Check if you have uncommitted changes
git status

# If you have changes, commit them
git add .
git commit -m "Final commit before Coolify deployment"

# Push to GitHub
git push origin main
```

**Your Repository:** `https://github.com/wastwagon/tourworldtourism`

---

### Step 2: Access Coolify Dashboard

1. Open your browser and go to: `http://31.97.57.75:8000` (or your VPS IP)
2. Log in to Coolify dashboard
3. You should see the "Servers" section

---

### Step 3: Add Your GitHub Repository as a Source

1. In Coolify, click on **"Sources"** in the left sidebar
2. Click **"+ Add"** button
3. Select **"GitHub"** as your source
4. Authorize Coolify to access your GitHub account
5. Select your repository: `wastwagon/tourworldtourism`
6. Choose branch: `main`
7. Click **"Add"**

---

### Step 4: Create PostgreSQL Database

1. In Coolify, click on **"Destinations"** in the left sidebar
2. Click **"+ Add"** button
3. Select **"PostgreSQL"**
4. Configure:
   - **Name**: `tourworld-tourism-db`
   - **Version**: `16` (or latest)
   - **Database Name**: `tourworld_tourism`
   - **Database User**: `tourworld_user`
   - **Database Password**: (create a strong password - **SAVE THIS!**)
5. Click **"Create"**
6. Wait for database to be created (takes 1-2 minutes)
7. **Important**: Copy the connection string/URL shown - you'll need it!

---

### Step 5: Create Your Application (Web Service)

1. In Coolify, click on **"Projects"** in the left sidebar
2. Click **"+ Add"** button
3. Select **"New Project"**
4. Name it: `tourworld-tourism`
5. Click **"Create"**

6. Inside your project, click **"+ Add"** → **"New Resource"**
7. Select **"Application"**
8. Choose **"GitHub"** as source
9. Select your repository: `wastwagon/tourworldtourism`
10. Branch: `main`
11. Click **"Next"**

---

### Step 6: Configure Application Settings

**Build Settings:**
- **Build Pack**: `Dockerfile` or `Nixpacks` (Coolify will auto-detect)
- **Build Command**: `npm install && npx prisma generate && npx prisma db push --accept-data-loss && npm run build`
- **Start Command**: `npm start`
- **Port**: `3000` (Next.js default)

**Environment Variables:**
Click **"Environment Variables"** and add:

```
NODE_ENV=production
DATABASE_URL=postgresql://tourworld_user:YOUR_PASSWORD@tourworld-tourism-db:5432/tourworld_tourism
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=http://your-domain.com
PORT=3000
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Important Notes:**
- Replace `YOUR_PASSWORD` with the database password you created
- Replace `your-domain.com` with your actual domain (or use your VPS IP initially)
- The `DATABASE_URL` format might be different in Coolify - check the database connection string from Step 4

---

### Step 7: Link Database to Application

1. In your application settings, look for **"Service Connections"** or **"Dependencies"**
2. Add the PostgreSQL database you created (`tourworld-tourism-db`)
3. This will automatically set up the connection

---

### Step 8: Configure Domain/Port

**Option A: Using Domain (Recommended)**
1. In application settings, go to **"Domains"**
2. Add your domain: `yourdomain.com`
3. Configure DNS: Point your domain's A record to your VPS IP: `31.97.57.75`
4. Coolify will handle SSL automatically

**Option B: Using IP Address (For Testing)**
1. In application settings, go to **"Ports"**
2. Set public port (e.g., `3000` or `80`)
3. Access via: `http://31.97.57.75:3000`

---

### Step 9: Deploy!

1. Review all settings
2. Click **"Deploy"** or **"Save & Deploy"**
3. Watch the build logs in real-time
4. First deployment takes 5-10 minutes

---

### Step 10: Post-Deployment

**After successful deployment:**

1. **Verify Database Connection:**
   - Check application logs in Coolify
   - Look for "Database connected" or similar messages
   - If errors, check `DATABASE_URL` environment variable

2. **Access Your Application:**
   - Visit your domain or IP:port
   - You should see your homepage!

3. **Create Admin User:**
   ```bash
   # In Coolify, open Terminal/SSH for your application
   node scripts/create-admin.js
   ```

4. **Seed Database (Optional):**
   ```bash
   npm run db:seed
   ```

---

## 🔧 Troubleshooting

### Build Fails

**Error: Prisma Client not generated**
- Check build command includes `npx prisma generate`
- Verify `DATABASE_URL` is set correctly

**Error: Database connection failed**
- Verify database is running in Coolify
- Check `DATABASE_URL` format matches Coolify's connection string
- Ensure database name, user, and password are correct

### Application Won't Start

**Check Logs:**
- In Coolify, go to your application → **"Logs"**
- Look for error messages
- Common issues:
  - Missing environment variables
  - Port conflicts
  - Database connection issues

### Database Connection String Format

Coolify might provide connection string in different formats:
- `postgresql://user:password@host:5432/database`
- Or separate variables: `POSTGRES_HOST`, `POSTGRES_USER`, etc.

**If using separate variables, update your `.env`:**
```env
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DATABASE}
```

---

## 📝 Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `DATABASE_URL` | From Coolify database | Connection string |
| `NEXTAUTH_SECRET` | Random string | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your domain/IP | `http://yourdomain.com` or `http://31.97.57.75:3000` |
| `PORT` | `3000` | Next.js port (optional) |

---

## 🎯 Quick Checklist

- [ ] All code pushed to GitHub
- [ ] GitHub repository connected to Coolify
- [ ] PostgreSQL database created in Coolify
- [ ] Application created and linked to GitHub
- [ ] Environment variables configured
- [ ] Database linked to application
- [ ] Domain/IP configured
- [ ] Application deployed successfully
- [ ] Database connection verified
- [ ] Admin user created
- [ ] Application accessible via browser

---

## 🔄 Updating Your Application

After making changes:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **In Coolify:**
   - Go to your application
   - Click **"Redeploy"** or **"Deploy"**
   - Coolify will pull latest changes and rebuild

---

## 📚 Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

## 🆘 Need Help?

If you encounter issues:
1. Check Coolify logs (Application → Logs)
2. Verify environment variables are set correctly
3. Ensure database is running and accessible
4. Check GitHub repository is connected properly

**Your Setup:**
- **VPS IP**: `31.97.57.75`
- **Coolify**: `http://31.97.57.75:8000`
- **GitHub Repo**: `wastwagon/tourworldtourism`
- **Branch**: `main`

Good luck with your deployment! 🚀

