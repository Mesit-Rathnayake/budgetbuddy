### Build stage
FROM node:20-alpine AS build
WORKDIR /usr/src/app
ENV CI=true
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

### Production stage - serve with nginx
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD wget -q --spider http://localhost/ || exit 1

CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
