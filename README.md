# TOURWORLD TOURISM - Minimal Setup

A clean, minimal Next.js 14 website for TOURWORLD TOURISM SERVICES LTD.

## 🎯 Current Status

**Phase 1: Core Structure** ✅ Complete
- Basic homepage
- Simple navigation
- Tours listing page
- Tour detail pages
- About & Contact pages

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3008](http://localhost:3008)

## 📁 Project Structure

```
app/
  ├── page.tsx          # Homepage
  ├── layout.tsx        # Root layout
  ├── tours/
  │   ├── page.tsx      # Tours listing
  │   └── [slug]/
  │       └── page.tsx  # Tour detail
  ├── about/
  │   └── page.tsx
  └── contact/
      └── page.tsx
```

## 🎨 Features

- ✅ Clean, minimal design
- ✅ Responsive layout
- ✅ Simple navigation
- ✅ Basic tour pages
- ✅ Ghana theme colors (red, yellow, green)

## 📋 Next Steps (Incremental)

### Phase 2: Add Database
- [ ] Set up Prisma
- [ ] Connect PostgreSQL
- [ ] Migrate tour data from backup

### Phase 3: Add Images
- [ ] Copy images from backup
- [ ] Add image components
- [ ] Update tour pages with images

### Phase 4: Add Functionality
- [ ] Booking form
- [ ] Contact form
- [ ] API routes

### Phase 5: Enhancements
- [ ] Better styling
- [ ] Animations
- [ ] SEO optimization

## 📦 Dependencies

- Next.js 16.1.1
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4

## 📝 Notes

This is a minimal setup. Features will be added incrementally as needed.
All content from the previous project is backed up and can be migrated gradually.

## 🚀 Deployment on Render

### Prerequisites
1. PostgreSQL database (local or cloud)
2. GitHub repository set up
3. Render account

### Environment Variables
Create a `.env` file with:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-app.onrender.com"
```

### Render Setup
1. Connect your GitHub repository to Render
2. Use the `render.yaml` blueprint file for automatic setup
3. Render will automatically:
   - Create a PostgreSQL database
   - Build and deploy your Next.js app
   - Set up environment variables

### Local Database Setup
```bash
# Start PostgreSQL (adjust port if needed)
# Then run migrations:
npm run db:migrate
# Or push schema:
npx prisma db push
# Generate Prisma client:
npm run db:generate
```

## 🔧 Database Connection Issues

If you see Prisma errors:
1. Ensure PostgreSQL is running: `pg_isready -h localhost -p 5436`
2. Check DATABASE_URL in `.env` file
3. Run `npx prisma db push` to sync schema
4. Run `npm run db:generate` to regenerate Prisma client
