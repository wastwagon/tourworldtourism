# 📁 How to Access File Manager in Coolify

## Method 1: Through Application Settings (Recommended)

1. **Go to Dashboard** (house icon in left sidebar)
2. **Click on your Project** (e.g., "My first project")
3. **Click on your Application** (e.g., `wastwagon/tourworldtourism:main`)
4. **Look for tabs** at the top:
   - General
   - Environment Variables
   - **Files** ← This is the file manager!
   - Terminal
   - Logs
   - etc.

5. **Click "Files" tab** - This will show the file manager for `/app/` directory

## Method 2: Upload via Terminal

If there's no Files tab, you can upload via terminal:

1. **Go to Terminal** (you're already there!)
2. **Select your application container** from the dropdown
3. **Use `cat` command** to create the file:

```bash
# Create the base64 file
cat > tourworld-dump-20260106-132703.sql.base64.txt << 'ENDOFFILE'
[paste base64 content here]
ENDOFFILE
```

## Method 3: Check Application Menu

When viewing your application:
- Look for a **"Files"** or **"File Manager"** button/link
- It might be in a dropdown menu (three dots `...`)
- Or in the left sidebar when viewing the application

## Quick Navigation Path

```
Dashboard → Projects → [Your Project] → [Your Application] → Files Tab
```

## Alternative: Use Terminal to Create File

Since you're already in Terminal, you can create the file directly:

```bash
# 1. Select your application container
# 2. Navigate to /app directory
cd /app

# 3. Create the base64 file using cat
cat > tourworld-dump-20260106-132703.sql.base64.txt << 'ENDOFFILE'
[paste the base64 content - I'll copy it to your clipboard]
ENDOFFILE

# 4. Verify it was created
ls -lh tourworld-dump-20260106-132703.sql.base64.txt

# 5. Run the import script
npm run db:import:coolify
```

---

**Note:** Coolify's file manager location may vary by version. If you can't find it, using Terminal (Method 2) is the most reliable way.

