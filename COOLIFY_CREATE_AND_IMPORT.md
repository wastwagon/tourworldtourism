# 🔧 Create SQL File and Import in Coolify

The SQL file doesn't exist yet. Create it from base64, then import.

## Method 1: Paste Base64 Content (Recommended)

**Step 1:** In Coolify Terminal, run this command:

```bash
base64 -d > tourworld-dump.sql << 'EOF'
```

**Step 2:** Paste the base64 content (from clipboard - I just copied it for you)

**Step 3:** After pasting, type:
```bash
EOF
```

**Step 4:** Press Enter, then verify:
```bash
ls -lh tourworld-dump.sql
head -10 tourworld-dump.sql
```

**Step 5:** Import:
```bash
psql $DATABASE_URL < tourworld-dump.sql
```

OR if psql not available:
```bash
docker run --rm -i postgres:16 psql $DATABASE_URL < tourworld-dump.sql
```

---

## Method 2: Upload Base64 File

If Coolify has file upload:

1. Upload `tourworld-dump-20260106-132703.sql.base64.txt` to Coolify
2. Then decode:
```bash
base64 -d tourworld-dump-20260106-132703.sql.base64.txt > tourworld-dump.sql
psql $DATABASE_URL < tourworld-dump.sql
```

---

## Method 3: Use Node.js to Create File

If base64 paste is too large, use this Node.js approach:

```bash
# Create a script that reads from stdin
cat > create-dump.js << 'SCRIPTEOF'
const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let base64Content = '';
console.log('Paste base64 content (press Ctrl+D when done):');

rl.on('line', (line) => {
  base64Content += line;
});

rl.on('close', () => {
  const sql = Buffer.from(base64Content, 'base64').toString('utf8');
  fs.writeFileSync('tourworld-dump.sql', sql);
  console.log('✅ SQL file created!');
  console.log('Now run: psql $DATABASE_URL < tourworld-dump.sql');
});
SCRIPTEOF

node create-dump.js
# Then paste the base64 content
# Press Ctrl+D when done
```

---

## Quick One-Liner (If base64 file uploaded)

```bash
base64 -d tourworld-dump-20260106-132703.sql.base64.txt > tourworld-dump.sql && psql $DATABASE_URL < tourworld-dump.sql
```

---

**The base64 content is in your clipboard - just paste it after running the `base64 -d` command!**

