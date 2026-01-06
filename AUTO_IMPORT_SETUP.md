# 🤖 Automatic Data Import on First Startup

The application now automatically imports data on first startup if the database is empty.

## How It Works

1. **On startup**, `start.sh` runs `auto-import-data.js`
2. **The script checks** if the database has any tours
3. **If empty**, it looks for `local-db-export-final.json` in the project root
4. **If found**, it imports all data automatically
5. **If not found**, it skips gracefully and continues startup

## Setup

### Option 1: Include JSON File in Repository (Recommended for First Deploy)

1. **Copy the JSON file** to your project root:
   ```bash
   cp local-db-export-final.json ./
   ```

2. **Commit it** (it will be included in the Docker image):
   ```bash
   git add local-db-export-final.json
   git commit -m "Add initial data for auto-import"
   ```

3. **Push and deploy** - data will import automatically on first startup!

### Option 2: Upload JSON File to Coolify After Deployment

1. **Deploy without the JSON file** (import will be skipped)
2. **Upload `local-db-export-final.json`** to `/app/` in Coolify
3. **Restart the application** - it will import on next startup

### Option 3: Manual Import (Current Method)

If you prefer manual control, you can still import manually using:
```bash
node scripts/import-json.js
```

## Benefits

✅ **Zero manual steps** - data imports automatically on first deploy  
✅ **Idempotent** - only imports if database is empty  
✅ **Safe** - won't overwrite existing data  
✅ **Optional** - works fine without the JSON file  

## Files Modified

- `scripts/start.sh` - Added auto-import call
- `scripts/auto-import-data.js` - New auto-import script
- `Dockerfile` - Copies auto-import script and optional JSON file

## Verification

After deployment, check logs for:
```
🔍 Checking if database needs data import...
📦 Database is empty, checking for data file...
📥 Importing data from JSON file...
✅ Imported X records
📊 Database now has: 12 tours, 5 hotels, 3 galleries
```

Or if data already exists:
```
✅ Database already has data, skipping import
```

---

**Ready to deploy!** Just include the JSON file and it will import automatically. 🚀

