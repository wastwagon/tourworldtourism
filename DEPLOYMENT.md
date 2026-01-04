# Deployment Guide for Tour World Tourism

## 🚀 Quick Start

### 1. Fix Database Connection (Local Development)

The Prisma errors occur because the PostgreSQL database isn't running. To fix:

```bash
# Start your PostgreSQL database on port 5436
# Then sync the schema:
npx prisma db push

# Generate Prisma client:
npm run db:generate

# Restart the dev server:
npm run dev
```

### 2. Git Setup

Your repository is already initialized. To connect to GitHub and push:

```bash
# Check current status
git status

# Add all files (except those in .gitignore)
git add .

# Commit changes
git commit -m "Initial commit: Tour World Tourism website"

# Push to GitHub
git push -u origin main
```

If you get authentication errors, you may need to:
- Use a personal access token instead of password
- Set up SSH keys
- Use GitHub CLI: `gh auth login`

### 3. Deploy to Render

#### Option A: Using Blueprint (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository: `wastwagon/tourworldtourism`
4. Render will automatically detect `render.yaml` and set up:
   - Web service (Next.js app)
   - PostgreSQL database
   - Environment variables

#### Option B: Manual Setup

1. **Create Database:**
   - Go to Render Dashboard → "New +" → "PostgreSQL"
   - Name: `tourworld-tourism-db`
   - Plan: Starter (Free tier available)
   - Copy the connection string

2. **Create Web Service:**
   - Go to "New +" → "Web Service"
   - Connect repository: `wastwagon/tourworldtourism`
   - Settings:
     - **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
     - **Start Command:** `npm start`
     - **Environment:** Node
     - **Plan:** Starter

3. **Set Environment Variables:**
   - `DATABASE_URL` - From your PostgreSQL database (auto-set if using blueprint)
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your Render app URL (e.g., `https://tourworld-tourism.onrender.com`)
   - `NODE_ENV` - `production`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - First deployment may take 5-10 minutes

### 4. Post-Deployment

After deployment:

1. **Run Database Migrations:**
   ```bash
   # In Render shell or locally with DATABASE_URL set:
   npx prisma migrate deploy
   ```

2. **Seed Database (Optional):**
   ```bash
   npm run db:seed
   ```

3. **Verify:**
   - Check health endpoint: `https://your-app.onrender.com/`
   - Check database connection in Render logs

## 🔧 Troubleshooting

### Prisma Errors

**Error:** `Invalid prisma.tour.findMany() invocation`

**Solution:**
1. Ensure database is running and accessible
2. Run `npx prisma db push` to sync schema
3. Run `npm run db:generate` to regenerate client
4. Restart the application

### Build Failures on Render

**Common Issues:**
- Missing environment variables → Check Render dashboard
- Database connection timeout → Verify DATABASE_URL
- Prisma client not generated → Check build logs for `prisma generate`

### Database Connection Issues

**Local:**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5436

# If not running, start PostgreSQL service
# macOS: brew services start postgresql@14
# Linux: sudo systemctl start postgresql
```

**Render:**
- Check database status in Render dashboard
- Verify DATABASE_URL is correctly set
- Check database logs for connection issues

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret for NextAuth sessions | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Public URL of your app | `https://your-app.onrender.com` |
| `NODE_ENV` | Environment mode | `production` |

## 🔐 Security Notes

- Never commit `.env` files to Git
- Use Render's environment variable management
- Rotate `NEXTAUTH_SECRET` periodically
- Use strong database passwords
- Enable SSL for database connections in production

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

