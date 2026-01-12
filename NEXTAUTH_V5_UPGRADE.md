# Next-Auth v5 (Auth.js) Upgrade Guide

## ✅ Upgrade Complete

Successfully upgraded from next-auth v4 to v5 (Auth.js) for full Next.js 15 compatibility.

## Changes Made

### 1. Package Updates
- **next-auth**: `^4.24.5` → `^5.0.0-beta.25`
- Installed with `--legacy-peer-deps` due to nodemailer version conflict

### 2. Core Authentication (`lib/auth.ts`)
- Migrated from `NextAuthOptions` to `NextAuth()` configuration
- Exports: `handlers`, `auth`, `signIn`, `signOut`
- Added `requireAdmin()` helper function for backward compatibility
- Supports both `AUTH_SECRET` and `NEXTAUTH_SECRET` environment variables

### 3. API Route Handler (`app/api/auth/[...nextauth]/route.ts`)
- Updated to use `handlers` export from Auth.js v5
- Exports `GET` and `POST` handlers

### 4. Admin Pages
- **Dashboard**: Updated to use `auth()` instead of `getServerSession()`
- All admin pages now compatible with Next.js 15 async APIs

### 5. Admin API Routes
All admin API routes updated:
- `app/api/admin/tours/**`
- `app/api/admin/bookings/**`
- `app/api/admin/inquiries/**`
- `app/api/admin/testimonials/**`
- `app/api/admin/blogs/**`
- `app/api/admin/hotels/**`
- `app/api/admin/galleries/**`
- `app/api/admin/upload/**`
- `app/api/admin/test-email/**`

**Changes:**
- Replaced `getServerSession(authOptions)` with `requireAdmin()`
- Removed duplicate `requireAdmin()` function definitions
- Updated imports from `'next-auth/next'` to `'@/lib/auth'`

## Environment Variables for Coolify

### Required Variables
```bash
# Use either AUTH_SECRET or NEXTAUTH_SECRET (both supported)
AUTH_SECRET=your-secret-key-here
# OR
NEXTAUTH_SECRET=your-secret-key-here

# Database (existing)
DATABASE_URL=postgresql://...

# Other existing variables remain the same
```

### Generating AUTH_SECRET
```bash
# Generate a secure secret
openssl rand -base64 32
```

## Coolify Deployment Notes

1. **Environment Variables**: Ensure `AUTH_SECRET` or `NEXTAUTH_SECRET` is set in Coolify
2. **Build Command**: No changes needed - standard `npm install && npm run build`
3. **Start Command**: No changes needed - standard `npm start`
4. **Dependencies**: The upgrade uses `--legacy-peer-deps` flag during install, but this is handled automatically

## Breaking Changes

### For Developers
- `getServerSession(authOptions)` → `auth()` or `requireAdmin()`
- Import from `'next-auth/next'` → `'@/lib/auth'`
- API route handlers use `handlers` export instead of `NextAuth(authOptions)`

### For Users
- **No breaking changes** - authentication flow remains identical
- Login/logout functionality unchanged
- Session management unchanged

## Benefits

✅ **Full Next.js 15 Compatibility**
- Resolves `headers()` and `cookies()` await warnings
- No more async API compatibility issues

✅ **Better Performance**
- Optimized for Next.js 15's async architecture
- Improved session handling

✅ **Future-Proof**
- Using the latest Auth.js architecture
- Better TypeScript support
- Improved error handling

## Testing Checklist

- [x] Admin login works
- [x] Admin dashboard loads
- [x] Admin API routes authenticate correctly
- [x] Session persistence works
- [x] Logout works
- [ ] Test in Coolify production environment

## Rollback Plan (if needed)

If issues occur, you can rollback by:
1. Revert the commit: `git revert 1ef41ca`
2. Reinstall v4: `npm install next-auth@4.24.5`
3. Restore previous `lib/auth.ts` and API routes

## Support

For issues related to:
- **Next.js 15 compatibility**: ✅ Resolved
- **Auth.js v5**: Check [Auth.js documentation](https://authjs.dev)
- **Coolify deployment**: Ensure environment variables are set correctly
