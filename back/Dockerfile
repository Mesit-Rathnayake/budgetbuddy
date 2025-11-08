# Use lightweight Node image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Optional: Add .npmrc to force registry usage
COPY .npmrc ./

# Install dependencies with retry (handles network issues)
RUN n=0; until [ $n -ge 5 ]; do \
      npm install --production --registry=https://registry.npmjs.org/ && break; \
      n=$((n+1)); echo "Retry $n..."; sleep 5; \
    done && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the rest of the source code
COPY . .

# Use non-root user
USER appuser

# Expose backend port (change if different)
EXPOSE 3001

# Start command
CMD ["node", "server.js"]
