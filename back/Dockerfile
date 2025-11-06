FROM node:20-alpine

WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install --production && \
	addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy source
COPY . .
RUN chown -R appuser:appgroup /usr/src/app

USER appuser

EXPOSE 5000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD wget -q --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
