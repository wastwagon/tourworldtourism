# 🔧 Database Connection Setup for Coolify

## Problem
Your application is running but the database is not connected. This guide will help you fix it.

## ✅ Quick Fix Steps

### Step 1: Check if Database Service Exists

1. Go to your **Coolify dashboard**
2. Look for a **PostgreSQL database service** in your project
3. If you don't have one, create it:
   - Click **"+ New Resource"** or **"Add Service"**
   - Select **"PostgreSQL"** or **"Database"**
   - Give it a name (e.g., `tourworld-db`)
   - Click **"Create"**

### Step 2: Get Database Connection String

1. Click on your **PostgreSQL database service**
2. Go to **"Environment Variables"** tab
3. Look for one of these variables:
   - `POSTGRES_URL`
   - `DATABASE_URL`
   - `POSTGRES_CONNECTION_STRING`
   - `POSTGRES_PRIVATE_URL`
4. **Copy the connection string** - it should look like:
   ```
   postgresql://username:password@postgresql-database-xxxxx:5432/database_name
   ```

### Step 3: Set DATABASE_URL in Your Application

1. Go back to your **application** (not the database)
2. Click on your application: `wastwagon/tourworldtourism:main-...`
3. Go to **"Environment Variables"** tab
4. Click **"+ Add"** or find existing `DATABASE_URL`
5. Set:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste the connection string you copied in Step 2
6. Click **"Add"** or **"Save"**

### Step 4: Link Database to Application (Important!)

1. Still in your application settings
2. Go to **"Service Connections"** or **"Dependencies"** tab
3. Click **"+ Add"** or **"Link Service"**
4. Select your PostgreSQL database service
5. Click **"Link"** or **"Add"**

This ensures your application can communicate with the database.

### Step 5: Redeploy

1. After setting `DATABASE_URL` and linking the database
2. Go to your application's main page
3. Click **"Redeploy"** button
4. Wait for deployment to complete

The startup script will automatically:
- ✅ Check if DATABASE_URL is set
- ✅ Generate Prisma Client
- ✅ Sync database schema (create tables)
- ✅ Start the application

## 🔍 Verify Database Connection

After redeployment, check the logs:

1. Go to your application
2. Click **"Logs"** tab
3. Look for these messages:
   - ✅ `DATABASE_URL is set`
   - ✅ `Generating Prisma Client...`
   - ✅ `Syncing database schema...`
   - ✅ `Database setup complete`

If you see errors, check:
- Is `DATABASE_URL` correctly set?
- Is the database service running?
- Is the database linked to your application?

## 🆘 Troubleshooting

### Error: "DATABASE_URL is not set"
- Make sure you added `DATABASE_URL` in your application's environment variables
- Make sure you saved the variable

### Error: "Connection refused" or "Cannot connect"
- Make sure the database service is running
- Make sure you linked the database in "Service Connections"
- Check if the database hostname is correct (should be the service name, not localhost)

### Error: "Schema sync failed"
- This might be okay if tables already exist
- Check the database logs for more details
- You can manually run migrations via Coolify Terminal:
  ```bash
  npx prisma db push
  ```

## 📝 Example DATABASE_URL Format

Your `DATABASE_URL` should look like this:
```
postgresql://tourworld_user:password123@postgresql-database-abc123:5432/tourworld_tourism
```

Where:
- `tourworld_user` = database username
- `password123` = database password  
- `postgresql-database-abc123` = database service name (from Coolify)
- `5432` = PostgreSQL port
- `tourworld_tourism` = database name

## ✅ Success Indicators

When everything is working, you should see:
- ✅ Application starts without errors
- ✅ No database connection errors in logs
- ✅ You can access admin pages (if configured)
- ✅ Data persists (tours, bookings, etc.)

---

**Need Help?** Check the application logs in Coolify for detailed error messages.

