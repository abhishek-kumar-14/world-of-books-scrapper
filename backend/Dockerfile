# Base image (common for all stages)
FROM node:20.18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---------------------
# Dependencies stage
# ---------------------
FROM base AS deps
COPY package*.json ./

# Use npm ci if you have package-lock.json, otherwise switch to npm install
RUN npm ci --omit=dev || npm install --omit=dev

# ---------------------
# Build stage
# ---------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------------------
# Runner stage (production)
# ---------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs

# Copy built app and production node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Logs dir
RUN mkdir -p logs && chown nestjs:nodejs logs

USER nestjs

EXPOSE 3001
ENV PORT=3001

CMD ["node", "dist/main.js"]
