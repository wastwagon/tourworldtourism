# 🚀 Creating File in Coolify (No nano available)

Since `nano` is not available in the container, use one of these methods:

## Method 1: Using `cat` with Here-Document (Easiest)

In Coolify Terminal, run:

```bash
cat > local-db-export-final.json << 'EOF'
```

Then:
1. **Paste** the entire JSON content from your clipboard (`Cmd+V`)
2. Press `Enter` to go to a new line
3. Type: `EOF`
4. Press `Enter` again

The file will be created!

**Verify:**
```bash
ls -lh local-db-export-final.json
```

Should show: `223K` file size

---

## Method 2: Using Node.js (Alternative)

If Method 1 doesn't work, you can use Node.js:

```bash
node
```

Then in the Node.js REPL:
```javascript
const fs = require('fs');
const data = `[PASTE YOUR ENTIRE JSON HERE]`;
fs.writeFileSync('local-db-export-final.json', data);
.exit
```

---

## Method 3: Split into Chunks (If file is too large)

If the file is too large to paste at once:

1. **Split the file locally** into smaller chunks
2. **Append each chunk**:
   ```bash
   echo 'CHUNK1' >> local-db-export-final.json
   echo 'CHUNK2' >> local-db-export-final.json
   # etc...
   ```

---

## ✅ Recommended: Method 1 (cat with here-document)

**Steps:**
1. Run: `cat > local-db-export-final.json << 'EOF'`
2. Paste: `Cmd+V` (your JSON content)
3. Press `Enter`
4. Type: `EOF`
5. Press `Enter`

**Then import:**
```bash
cat local-db-export-final.json | node scripts/import-to-production.js
```

---

**Try Method 1 first - it's the simplest!**

