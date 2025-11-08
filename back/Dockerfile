FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install system deps (wget & certs) and create non-root user in one layer
RUN apk add --no-cache ca-certificates wget \
  && addgroup -S appgroup \
  && adduser -S appuser -G appgroup

# Copy package files and install dependencies (use npm ci when lockfile present)
# Use --chown to avoid an extra chown layer later.
COPY --chown=root:root package*.json ./
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev --no-audit --no-fund; \
    else \
      npm install --production --no-audit --no-fund; \
    fi

# Copy app source (owned by root) and then switch to appuser for runtime
COPY --chown=root:root . .
RUN chown -R appuser:appgroup /usr/src/app

# Switch to non-root user
USER appuser

# Runtime settings
ENV NODE_ENV=production
EXPOSE 5000

# Lightweight HTTP healthcheck (uses wget installed above)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
