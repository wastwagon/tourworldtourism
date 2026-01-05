# Tourworld Tourism - Complete Development Stack

## 🚀 Overview
A full-stack Content Management System (CMS) and tourism website built with modern web technologies for managing tours, bookings, hotels, blogs, galleries, and testimonials.

---

## 📦 Core Framework & Runtime

### **Frontend Framework**
- **Next.js 15.2.4** - React framework with App Router
- **React 19.2.3** - UI library
- **React DOM 19.2.3** - React rendering

### **Language**
- **TypeScript 5** - Type-safe JavaScript

### **Port Configuration**
- Development: `localhost:3008`
- Production: Port `3008`

---

## 🎨 Styling & UI

### **CSS Framework**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.23** - CSS vendor prefixing

### **UI Components**
- **Heroicons React 2.2.0** - Icon library
- Custom reusable components:
  - `SafeImage` - Image handling with fallbacks
  - `ImageUpload` - Single image upload component
  - `MultipleImageUpload` - Multiple image upload component
  - `AdminLayout` - Admin panel layout
  - `Hero` - Hero section with tour slider
  - `BookingForm` - Tour booking form
  - `TestimonialForm` - Testimonial submission form
  - And more...

---

## 🗄️ Database & ORM

### **Database**
- **PostgreSQL** - Relational database

### **ORM & Database Tools**
- **Prisma 7.2.0** - Next-generation ORM
- **@prisma/client 7.2.0** - Prisma client
- **@prisma/adapter-pg 7.2.0** - PostgreSQL adapter
- **pg 8.16.3** - PostgreSQL client for Node.js
- **@types/pg 8.16.0** - TypeScript types

### **Database Models** (10 models)
1. **Tour** - Tour packages with itineraries, pricing, images
2. **Booking** - Customer bookings and reservations
3. **Hotel** - Hotel listings and information
4. **Attraction** - Tourist attractions
5. **User** - Admin and customer users
6. **ContactInquiry** - Contact form submissions
7. **Newsletter** - Newsletter subscriptions
8. **Testimonial** - Customer testimonials
9. **Blog** - Blog posts and articles
10. **Gallery** - Image galleries

---

## 🔐 Authentication & Security

### **Authentication**
- **NextAuth.js 4.24.5** - Authentication library
- **@auth/prisma-adapter 2.11.1** - Prisma adapter for NextAuth
- **bcryptjs 3.0.3** - Password hashing
- **@types/bcryptjs 2.4.6** - TypeScript types

### **User Roles**
- `admin` - Full system access
- `manager` - Limited admin access
- `customer` - Public user

---

## 📡 API & Data Fetching

### **API Architecture**
- **RESTful API Routes** - Next.js API routes
- **Server Components** - React Server Components for data fetching
- **Client Components** - Interactive client-side components

### **API Endpoints Structure**
```
/api/
  /admin/
    /tours/          - Tour CRUD operations
    /bookings/       - Booking management
    /inquiries/      - Contact inquiry management
    /testimonials/   - Testimonial management
    /galleries/      - Gallery management
    /hotels/         - Hotel management
    /blogs/          - Blog management
    /upload/         - File upload endpoint
  /tours/            - Public tour API
  /bookings/         - Public booking submission
  /testimonials/     - Public testimonial submission
  /galleries/        - Public gallery API
  /hotels/           - Public hotel API
  /blogs/            - Public blog API
```

---

## 📁 File Upload & Media Management

### **File Upload System**
- **Local File Storage** - Files stored in `/public/images/`
- **Multipart Form Data** - File upload handling
- **Image Categories**:
  - `tours/` - Tour images
  - `hotels/` - Hotel images
  - `blogs/` - Blog images
  - `galleries/` - Gallery images
  - `testimonials/` - Testimonial photos

### **Image Processing**
- Client-side image preview
- File type validation (JPEG, PNG, WEBP, GIF)
- File size validation (max 10MB)
- Automatic path generation

---

## 🛠️ Development Tools

### **Build Tools**
- **Next.js Build System** - Built-in bundler
- **TypeScript Compiler** - Type checking and compilation

### **Code Quality**
- **ESLint 9** - Code linting
- **eslint-config-next 16.1.1** - Next.js ESLint config

### **Development Utilities**
- **tsx 4.21.0** - TypeScript execution
- **dotenv 17.2.3** - Environment variable management
- **@types/node 20** - Node.js TypeScript types
- **@types/react 19** - React TypeScript types
- **@types/react-dom 19** - React DOM TypeScript types

---

## 📚 Content Management

### **Content Processing**
- **marked 17.0.1** - Markdown to HTML conversion
- **cheerio 1.1.2** - HTML parsing and manipulation

### **Utilities**
- **slugify 1.6.6** - URL-friendly slug generation
- **axios 1.13.2** - HTTP client

---

## 🏗️ Project Structure

```
tourworld-fresh/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── about/             # About page
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   ├── gallery/           # Gallery pages
│   ├── hotels/            # Hotels pages
│   ├── testimonials/      # Testimonials page
│   └── tours/             # Tour pages
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   └── prisma.ts         # Prisma client
├── prisma/                # Database schema & migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── public/                # Static assets
│   └── images/           # Uploaded images
├── scripts/               # Utility scripts
└── package.json          # Dependencies
```

---

## 🎯 Key Features

### **Frontend Features**
- ✅ Mobile-first responsive design
- ✅ Tour slider/carousel with auto-play
- ✅ Dynamic image galleries
- ✅ Booking form with validation
- ✅ Testimonial submission system
- ✅ Newsletter signup
- ✅ Search and filtering
- ✅ SEO-optimized pages

### **Admin Panel Features**
- ✅ Full CRUD operations for all entities
- ✅ Image upload with preview
- ✅ Rich text editing (markdown support)
- ✅ Tour itinerary builder
- ✅ Booking management
- ✅ Testimonial approval system
- ✅ Dashboard with statistics
- ✅ Role-based access control

### **API Features**
- ✅ RESTful API endpoints
- ✅ File upload API
- ✅ Authentication middleware
- ✅ Error handling
- ✅ Data validation

---

## 🔧 Configuration Files

- **package.json** - Dependencies and scripts
- **tsconfig.json** - TypeScript configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **prisma/schema.prisma** - Database schema
- **eslint.config.mjs** - ESLint configuration

---

## 📝 Scripts Available

```bash
# Development
npm run dev              # Start development server (port 3008)

# Production
npm run build            # Build for production
npm start                # Start production server (port 3008)

# Database
npm run db:migrate       # Run database migrations
npm run db:generate      # Generate Prisma client
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
```

---

## 🌐 Deployment Considerations

### **Environment Variables Required**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Application URL

### **File Storage**
- Currently using local file system (`/public/images/`)
- Can be migrated to cloud storage (AWS S3, Cloudinary, etc.)

### **Database**
- PostgreSQL database required
- Prisma migrations for schema management

---

## 📊 Technology Summary

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 3 |
| **Database** | PostgreSQL |
| **ORM** | Prisma 7 |
| **Authentication** | NextAuth.js 4 |
| **Icons** | Heroicons |
| **File Upload** | Custom implementation |
| **Markdown** | Marked |
| **HTTP Client** | Axios |

---

## 🎨 Design Philosophy

- **Mobile-First** - Responsive design starting from mobile
- **Component-Based** - Reusable React components
- **Type-Safe** - Full TypeScript coverage
- **Server-Side Rendering** - SEO-friendly pages
- **Progressive Enhancement** - Works without JavaScript where possible

---

## 📈 Performance Optimizations

- Image optimization with Next.js Image component
- Server-side rendering for SEO
- Code splitting with Next.js
- Lazy loading for images
- Optimized database queries with Prisma

---

## 🔒 Security Features

- Password hashing with bcryptjs
- Role-based access control
- Protected API routes
- Input validation
- SQL injection prevention (Prisma)
- XSS protection (React)

---

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

---

**Last Updated:** January 2025
**Project Version:** 0.1.0

