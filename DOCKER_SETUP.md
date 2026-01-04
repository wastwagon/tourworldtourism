# 🐳 Docker PostgreSQL Setup

Since you have Docker Desktop running, this is the easiest way to get PostgreSQL working!

## Quick Start (2 commands)

```bash
# 1. Start PostgreSQL container
docker-compose up -d

# 2. Wait a few seconds, then sync your database schema
npx prisma db push
npm run db:generate
```

That's it! Your database will be running on port 5436 (matching your `.env` file).

## What This Does

- Creates a PostgreSQL 14 container
- Maps port 5436 (your app) → 5432 (PostgreSQL)
- Creates database: `tourworld_tourism`
- Username: `postgres`
- Password: `password`
- Data persists in a Docker volume

## Verify It's Running

```bash
# Check container status
docker ps | grep tourworld-postgres

# Check logs
docker logs tourworld-postgres

# Test connection
docker exec -it tourworld-postgres psql -U postgres -d tourworld_tourism -c "SELECT 1;"
```

## Stop/Start Database

```bash
# Stop database
docker-compose stop

# Start database
docker-compose start

# Stop and remove (keeps data)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

## Your .env File

Your current `.env` should work perfectly:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5436/tourworld_tourism"
```

## After Starting

Once the container is running:

1. **Sync schema:**
   ```bash
   npx prisma db push
   ```

2. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

The Prisma errors should disappear! 🎉

## Troubleshooting

**Container won't start:**
```bash
# Check if port 5436 is already in use
lsof -i :5436

# View container logs
docker logs tourworld-postgres
```

**Connection refused:**
- Wait 10-15 seconds after starting (PostgreSQL needs time to initialize)
- Verify container is running: `docker ps`
- Check logs: `docker logs tourworld-postgres`

**Reset database:**
```bash
# Stop and remove everything
docker-compose down -v

# Start fresh
docker-compose up -d
```

