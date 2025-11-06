# === Build stage ===
FROM node:20-alpine AS build
WORKDIR /usr/src/app
# Do not force CI=true here; set to false so local Docker builds do not treat
# ESLint warnings as errors. CI environments can override this if needed.
ENV CI=false
# Increase Node's heap during build to avoid memory-related build failures
# (useful when building inside constrained Docker environments).
ENV NODE_OPTIONS=--max_old_space_size=4096

# Copy dependency files first
COPY package*.json ./

# Install all dependencies (this installs react-scripts too)
# Use `npm ci` for reproducible installs and prefer offline to reduce network flakiness.
RUN npm ci --prefer-offline --no-audit --no-fund || npm install --no-audit --no-fund

# Copy rest of app and build
COPY . .
RUN npm run build

# === Production stage - serve with nginx ===
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
