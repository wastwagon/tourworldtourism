# 🔐 Environment Variables for Your Application

Copy these into Coolify when creating your application:

## Required Environment Variables

### 1. NODE_ENV
```
NODE_ENV=production
```

### 2. DATABASE_URL
```
postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism
```

**Note:** Replace `postgresql-database-jc48w0kggo0s88sog4s8008c` with your actual database service name from Coolify.

**To find it:**
- Go to your database in Coolify
- Look at the URL or service name
- It should be something like: `postgresql-database-[random-id]`

### 3. NEXTAUTH_SECRET
```
Is3YLDBl8Bw7PlBQQQyHmW8/BWZaW4DhKsMyT/xwMJA=
```

### 4. NEXTAUTH_URL
```
http://31.97.57.75:3000
```

**Later, when you have a domain, change this to:**
```
https://yourdomain.com
```

### 5. PORT
```
PORT=3000
```

---

## 📋 Quick Copy-Paste Checklist

When adding environment variables in Coolify:

- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = `[get from database Environment Variables tab]`
- [ ] `NEXTAUTH_SECRET` = `Is3YLDBl8Bw7PlBQQQyHmW8/BWZaW4DhKsMyT/xwMJA=`
- [ ] `NEXTAUTH_URL` = `http://31.97.57.75:3000`
- [ ] `PORT` = `3000`

---

## 🔍 How to Find DATABASE_URL in Coolify

1. Go to your database: `postgresql-database-jc48w0kggo0s88sog4s8008c`
2. Click **"Environment Variables"** tab (left sidebar)
3. Look for:
   - `POSTGRES_URL` OR
   - `DATABASE_URL` OR
   - `POSTGRES_CONNECTION_STRING`
4. Copy that value - that's your `DATABASE_URL`!

---

## ✅ After Adding Variables

1. Make sure all 5 variables are added
2. Link the database to your application (Service Connections)
3. Click **"Deploy"**
4. Wait 5-10 minutes
5. Visit: `http://31.97.57.75:3000`

