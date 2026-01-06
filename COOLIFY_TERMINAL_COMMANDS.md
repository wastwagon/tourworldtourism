# 🚀 Commands to Run in Coolify Terminal

## Step 1: Check Current Directory

```bash
pwd
ls -la
```

## Step 2: Create Export File

**Option A: Using nano (Recommended)**
```bash
nano local-db-export-final.json
```
Then paste the entire contents of `local-db-export-final.json` from your local machine.

**Option B: Using cat with here-document**
```bash
cat > local-db-export-final.json << 'EOF'
```
Then paste the JSON content, and end with:
```bash
EOF
```

## Step 3: Verify File Created

```bash
ls -lh local-db-export-final.json
```
Should show: `223K` file size

## Step 4: Run Import

```bash
cat local-db-export-final.json | node scripts/import-to-production.js
```

## Step 5: Verify Import

```bash
node -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); Promise.all([p.tour.count(),p.hotel.count(),p.attraction.count(),p.blog.count(),p.gallery.count()]).then(([t,h,a,b,g])=>console.log('✅ Tours:',t,'Hotels:',h,'Attractions:',a,'Blogs:',b,'Galleries:',g));"
```

Expected output:
- Tours: 12
- Hotels: 5
- Attractions: 18
- Blogs: 9
- Galleries: 3

---

## 🆘 If Scripts Don't Exist

If `scripts/import-to-production.js` doesn't exist, check:
```bash
ls -la scripts/
```

If missing, you may need to wait for the next deployment or manually create the import script.

---

## ✅ Quick Copy-Paste Method

1. **Copy entire file** from your local machine:
   ```bash
   # On your Mac, run:
   cat local-db-export-final.json | pbcopy
   ```

2. **In Coolify Terminal**, run:
   ```bash
   nano local-db-export-final.json
   ```

3. **Paste**: Cmd+V (or right-click → Paste)

4. **Save**: Ctrl+X, then Y, then Enter

5. **Import**:
   ```bash
   cat local-db-export-final.json | node scripts/import-to-production.js
   ```

---

**Ready?** The file is already in your clipboard from earlier. Just paste it into Coolify Terminal!

