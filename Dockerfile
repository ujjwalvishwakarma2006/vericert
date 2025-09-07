# --- Base builder image ---
FROM node:20-alpine AS deps
WORKDIR /app
# Install system deps required by @napi-rs/canvas
RUN apk add --no-cache libc6-compat build-base cairo-dev pango-dev giflib-dev libjpeg-turbo-dev
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# --- Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat build-base cairo-dev pango-dev giflib-dev libjpeg-turbo-dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Production runtime ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Add required system libs for canvas runtime
RUN apk add --no-cache cairo pango giflib libjpeg-turbo

# Copy standalone output and public assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create a non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
