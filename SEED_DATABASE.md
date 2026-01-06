# ✅ Seed Database with Sample Data

## ✅ Tables Created Successfully!

Now let's add sample data:

---

## ✅ Step 1: Seed Database

```bash
# Seed with sample data
node seed-now.js
```

---

## ✅ Step 2: Update DATABASE_URL in Coolify

**Important:** Update the `DATABASE_URL` in Coolify so it persists across container restarts:

1. **Go to Coolify → Your Application → Environment Variables**
2. **Find `DATABASE_URL`** (or create it if it doesn't exist)
3. **Set it to:**
   ```
   postgresql://tourworld_user:TourWorld2025!Secure@jc48w0kggo0s88sog4s8oo8c:5432/tourworld_tourism
   ```
4. **Save** and **restart the application** (if needed)

---

## ✅ Step 3: Verify Website

After seeding:
1. **Visit your website** (the domain shown in Coolify)
2. **Check if content appears:**
   - Tours
   - Hotels
   - Blogs
   - Gallery

---

## 🎯 Expected Results

After `node seed-now.js`:
- ✅ Sample tours created
- ✅ Sample hotels created
- ✅ Sample blogs created
- ✅ Your website should show content!

**Run the seed command now!** 🚀

