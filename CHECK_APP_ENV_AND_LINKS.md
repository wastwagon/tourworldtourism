# 🔍 Check Application Environment Variables & Linked Resources

## ✅ You're in the Application Configuration!

Now let's check two important things:

---

## 📋 Step 1: Check Environment Variables

1. **Click "Environment Variables"** in the left sub-menu (under Configuration)
2. **Look for `DATABASE_URL`** - Coolify might have set it automatically
3. **Copy the exact value** if it exists

---

## 📋 Step 2: Check Linked Resources

1. **Look for "Linked Resources"** or **"Database"** section in the left sub-menu
2. **Or scroll down** in the General tab to see if there's a "Linked Resources" section
3. **Check if your database is listed** as a linked resource
4. **If not linked:**
   - There should be an option to link it
   - Linking will automatically configure `DATABASE_URL`

---

## 🎯 What to Look For

### In Environment Variables:
- `DATABASE_URL` - Should show the correct connection string
- Other database-related variables

### In Linked Resources:
- Your PostgreSQL database should be listed
- If linked, it should show connection details

---

## ✅ If Database is Linked

If the database is linked, Coolify should have automatically set `DATABASE_URL` in the environment variables. Use that exact value!

---

## 🔧 If Not Linked

If the database isn't linked:
1. Find the option to "Link Resource" or "Add Database"
2. Select your PostgreSQL database
3. This will automatically configure the connection

**Check both sections and share what you find!** 🚀

