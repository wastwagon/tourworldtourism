# 📁 Create File in Coolify Terminal

Coolify doesn't have a traditional file manager. Use Terminal instead.

## Steps to Create Base64 File

### Step 1: Go to Terminal Tab

In your application page, click the **"Terminal"** tab at the top (next to "Configuration", "Deployments", "Logs").

### Step 2: Select Your Container

Select your application container from the dropdown.

### Step 3: Create the Base64 File

Run this command:

```bash
cd /app
cat > tourworld-dump-20260106-132703.sql.base64.txt << 'ENDOFFILE'
```

### Step 4: Paste Base64 Content

Paste the entire base64 content (it's in your clipboard - ~249KB, one long string).

### Step 5: Close the File

After pasting, type:
```bash
ENDOFFILE
```

Press Enter.

### Step 6: Verify

```bash
ls -lh tourworld-dump-20260106-132703.sql.base64.txt
```

Should show ~256KB file.

### Step 7: Run Import

```bash
npm run db:import:coolify
```

---

## Alternative: Check Advanced Tab

If you want to explore other options:
1. In Configuration, click **"Advanced"** in the left sidebar
2. Look for file management options there

But **Terminal is the recommended way** - it's the most reliable method.

---

**Quick Summary:**
1. Click **"Terminal"** tab (top of page)
2. Select container
3. Run: `cat > tourworld-dump-20260106-132703.sql.base64.txt << 'ENDOFFILE'`
4. Paste base64 content
5. Type: `ENDOFFILE`
6. Run: `npm run db:import:coolify`

