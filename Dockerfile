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

# Accept build arguments (can be overridden by Coolify's build-time env vars)
ARG DATABASE_URL="postgresql://placeholder"
ARG NEXTAUTH_SECRET="build-time-placeholder-must-be-set-at-runtime"
ARG NEXTAUTH_URL="http://localhost:3000"

# Set as environment variables for the build
ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
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
COPY --from=builder /app/scripts/ensure-upload-dirs.js ./scripts/ensure-upload-dirs.js

# Copy data file if it exists (optional - for auto-import on first startup)
# Using RUN with mount to conditionally copy - if file doesn't exist, this step is skipped
# The auto-import script will gracefully handle a missing file at runtime
RUN --mount=type=bind,from=builder,source=/app,target=/builder-source \
    if [ -f /builder-source/local-db-export-final.json ]; then \
        cp /builder-source/local-db-export-final.json ./local-db-export-final.json; \
    fi || true

# Set correct permissions
RUN chown -R nextjs:nodejs /app
RUN chmod +x ./scripts/start.sh
RUN chmod +x ./scripts/auto-import-data.js
RUN chmod +x ./scripts/ensure-upload-dirs.js
# Ensure public/images directories exist and are writable
RUN mkdir -p public/images/{galleries,testimonials,tours,hotels,blogs,general} && \
    chown -R nextjs:nodejs public/images && \
    chmod -R 755 public/images

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./scripts/start.sh"]

