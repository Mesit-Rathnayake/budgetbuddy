FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install runtime dependencies first (copied separately so Docker caches installs)
COPY package*.json ./

# Ensure wget is available for healthchecks and install node deps reproducibly.
# Use `npm ci` when a lockfile exists, otherwise fall back to `npm install`.
RUN apk add --no-cache wget ca-certificates \ 
  && if [ -f package-lock.json ]; then npm ci --omit=dev --no-audit --no-fund; else npm install --production --no-audit --no-fund; fi \
  && addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy application source and set ownership
COPY . .
RUN chown -R appuser:appgroup /usr/src/app

# Run as non-root user
USER appuser

# Runtime settings
EXPOSE 5000
ENV NODE_ENV=production

# Lightweight HTTP healthcheck (uses wget installed above)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
