# 🎯 Simple SQL Import - Traditional Method

You're right, let's keep it simple. Here's the traditional way:

## Method 1: Direct SQL Import (Simplest)

If you can upload the SQL file directly to Coolify:

```bash
# Just import it directly
psql $DATABASE_URL < tourworld-dump.sql
```

That's it. One command.

## Method 2: If File Not There Yet

**Step 1:** Upload `tourworld-dump-20260106-132703.sql` to `/app/` in Coolify

**Step 2:** Run:
```bash
psql $DATABASE_URL < tourworld-dump-20260106-132703.sql
```

Done.

## Method 3: Create SQL File from Base64 (One Command)

If you only have base64, decode it once:

```bash
base64 -d tourworld-dump-20260106-132703.sql.base64.txt > tourworld-dump.sql
psql $DATABASE_URL < tourworld-dump.sql
```

---

**That's it. No scripts, no complexity. Just traditional SQL import.**

The SQL file is already created on your local machine: `tourworld-dump-20260106-132703.sql`

Just upload it and run `psql $DATABASE_URL < tourworld-dump.sql`

