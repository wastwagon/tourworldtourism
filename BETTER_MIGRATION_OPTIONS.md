# 🚀 Better Database Migration Options

The JSON export/import approach is fragile due to copy-paste corruption. Here are better alternatives:

## Option 1: PostgreSQL Dump (pg_dump) - **RECOMMENDED** ⭐

This is the most robust method. PostgreSQL's native dump format handles all edge cases.

### Step 1: Create SQL Dump Locally

```bash
# On your local machine
pg_dump -h localhost -p 5436 -U postgres -d tourworld_tourism \
  --format=custom \
  --file=tourworld-dump.dump

# Or plain SQL format (easier to inspect)
pg_dump -h localhost -p 5436 -U postgres -d tourworld_tourism \
  --format=plain \
  --file=tourworld-dump.sql
```

### Step 2: Transfer to Coolify

**Method A: Base64 Encoding (for SQL file)**
```bash
# On local machine
base64 tourworld-dump.sql > tourworld-dump-base64.txt

# Copy content to Coolify Terminal, then:
base64 -d tourworld-dump-base64.txt > tourworld-dump.sql
```

**Method B: Direct Upload (if Coolify supports file upload)**
- Use Coolify's file upload feature if available

**Method C: SCP (if you have SSH access)**
```bash
scp tourworld-dump.sql user@31.97.57.75:/tmp/
```

### Step 3: Import in Coolify Terminal

```bash
# In Coolify Terminal
# First, get your production DATABASE_URL
echo $DATABASE_URL

# Extract connection details and import
# Format: postgresql://user:pass@host:port/dbname
# Use psql or pg_restore

# For SQL dump:
psql $DATABASE_URL < tourworld-dump.sql

# For custom dump:
pg_restore -d $DATABASE_URL tourworld-dump.dump
```

---

## Option 2: Direct Database Connection (If Production DB is Accessible)

If you can expose your production database temporarily:

### Step 1: Get Production DB External Connection

In Coolify, check if your PostgreSQL database has:
- External port mapping (e.g., `5432:5432`)
- Public IP access

### Step 2: Use pg_dump with Direct Connection

```bash
# On local machine
pg_dump "postgresql://tourworld_user:password@31.97.57.75:5432/tourworld_tourism" \
  --format=plain \
  --file=tourworld-dump.sql
```

### Step 3: Import Directly

```bash
# Still on local machine
psql "postgresql://tourworld_user:password@31.97.57.75:5432/tourworld_tourism" \
  < tourworld-dump.sql
```

**⚠️ Security Note:** Only do this temporarily and use strong passwords!

---

## Option 3: Improved JSON Export (Current Method, But Better)

If you want to stick with JSON, make it more robust:

### Step 1: Export with Compression

```bash
# On local machine
node scripts/export-local-db.js | gzip > local-db-export.json.gz

# Base64 encode the compressed file
base64 local-db-export.json.gz > local-db-export-base64.txt
```

### Step 2: Transfer and Decompress

```bash
# In Coolify Terminal
base64 -d local-db-export-base64.txt | gunzip > local-db-export-final.json

# Then import
node clean-and-import.js
```

**Benefits:**
- Smaller file size
- Less corruption risk
- Single base64 string

---

## Option 4: Prisma Migrate with Data Seeding

Use Prisma's migration system with seed data:

### Step 1: Create Migration Script

```typescript
// prisma/migrate-data.ts
import { PrismaClient } from '@prisma/client';

const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.LOCAL_DATABASE_URL
    }
  }
});

const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function migrate() {
  // Export from local
  const tours = await localPrisma.tour.findMany();
  const hotels = await localPrisma.hotel.findMany();
  // ... etc

  // Import to production
  for (const tour of tours) {
    await prodPrisma.tour.upsert({
      where: { slug: tour.slug },
      update: tour,
      create: tour
    });
  }
  // ... etc
}
```

### Step 2: Run in Coolify

Set both `LOCAL_DATABASE_URL` and `DATABASE_URL`, then run the script.

**⚠️ Limitation:** Requires local DB to be accessible from Coolify (not typical).

---

## Option 5: Use a Migration Service/Tool

Tools like:
- **DBeaver** - Can connect to both databases and sync
- **pgAdmin** - Has migration tools
- **Flyway** / **Liquibase** - Database migration frameworks

---

## 🎯 **RECOMMENDED APPROACH**

**Use Option 1 (pg_dump)** because:
- ✅ Most reliable (PostgreSQL's native format)
- ✅ Handles all data types correctly
- ✅ Preserves relationships
- ✅ Can be compressed
- ✅ Standard PostgreSQL tool

### Quick Start with pg_dump:

```bash
# 1. Local: Create dump
pg_dump -h localhost -p 5436 -U postgres -d tourworld_tourism \
  --format=plain \
  --no-owner \
  --no-acl \
  > tourworld-dump.sql

# 2. Local: Base64 encode
base64 tourworld-dump.sql > tourworld-dump-base64.txt

# 3. Copy base64 content to Coolify Terminal

# 4. Coolify: Decode and import
base64 -d tourworld-dump-base64.txt > tourworld-dump.sql
psql $DATABASE_URL < tourworld-dump.sql
```

---

## 📊 Comparison

| Method | Reliability | Speed | Complexity | Best For |
|--------|------------|-------|------------|----------|
| pg_dump | ⭐⭐⭐⭐⭐ | Fast | Low | **Production** |
| JSON Export | ⭐⭐ | Medium | Medium | Development |
| Direct Connection | ⭐⭐⭐⭐ | Fastest | Medium | If DB accessible |
| Prisma Migrate | ⭐⭐⭐ | Slow | High | Schema + Data |

---

## 🔧 Troubleshooting

### If pg_dump is not installed:
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Or use Docker
docker run --rm -v $(pwd):/data postgres:15 \
  pg_dump -h host.docker.internal -p 5436 -U postgres -d tourworld_tourism \
  --file=/data/tourworld-dump.sql
```

### If psql is not available in Coolify:
```bash
# Use Docker to run psql
docker run --rm -i postgres:15 psql $DATABASE_URL < tourworld-dump.sql
```

---

**Next Steps:** Choose Option 1 and I'll help you set it up! 🚀

