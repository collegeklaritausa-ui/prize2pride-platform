# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║              PRIZE2PRIDE ETERNAL CONTAINER                                ║
# ║                                                                           ║
# ║  Optimized, secure, and resilient container image                         ║
# ║  Version: OMEGA777 2.5                                                    ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# ═══════════════════════════════════════════════════════════════════════════
# STAGE 1: Dependencies
# ═══════════════════════════════════════════════════════════════════════════
FROM node:22-alpine AS deps
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# ═══════════════════════════════════════════════════════════════════════════
# STAGE 2: Builder
# ═══════════════════════════════════════════════════════════════════════════
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN pnpm run build

# ═══════════════════════════════════════════════════════════════════════════
# STAGE 3: Production
# ═══════════════════════════════════════════════════════════════════════════
FROM node:22-alpine AS production
WORKDIR /app

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 prize2pride

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/drizzle ./drizzle

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/trpc/system.health || exit 1

# Switch to non-root user
USER prize2pride

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/server/index.js"]

# ═══════════════════════════════════════════════════════════════════════════
# LABELS
# ═══════════════════════════════════════════════════════════════════════════
LABEL org.opencontainers.image.title="Prize2Pride Platform"
LABEL org.opencontainers.image.description="Eternal Language Learning Platform - OMEGA777"
LABEL org.opencontainers.image.version="2.5.0-OMEGA777"
LABEL org.opencontainers.image.vendor="Prize2Pride"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/collegeklaritausa-ui/prize2pride-platform"
