# Use Node.js 20 LTS
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV DATABASE_URL="postgresql://placeholder"
ENV NEXTAUTH_SECRET="build-time-placeholder-must-be-set-at-runtime"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma files and necessary node_modules for runtime
# Install Prisma and tsx locally (not globally) so all dependencies are available
COPY --from=builder /app/package.json ./package.json
RUN npm install --production --legacy-peer-deps prisma@^6.0.0 pg @prisma/client@^6.0.0 tsx

# Copy Prisma Client (already generated from build)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy Prisma schema
COPY --from=builder /app/prisma ./prisma

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy startup script and auto-import script
COPY --from=builder /app/scripts/start.sh ./scripts/start.sh
COPY --from=builder /app/scripts/auto-import-data.js ./scripts/auto-import-data.js

# Copy data file if it exists (optional - for auto-import on first startup)
# If the file doesn't exist, the import will be skipped gracefully
COPY --from=builder /app/local-db-export-final.json ./local-db-export-final.json 2>/dev/null || true

# Set correct permissions
RUN chown -R nextjs:nodejs /app
RUN chmod +x ./scripts/start.sh
RUN chmod +x ./scripts/auto-import-data.js

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./scripts/start.sh"]

