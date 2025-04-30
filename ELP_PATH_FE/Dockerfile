# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli

# Copy source code and build Angular app
COPY . .
RUN ng build --configuration=production

# Nginx Stage
FROM nginx:alpine AS runner

# Copy build files to Nginx's default root location
COPY --from=builder /app/dist/elp_app_angular /usr/share/nginx/html

# Copy custom Nginx configuration (if you have one)
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY angular.conf /etc/nginx/conf.d/angular.conf

# Expose Nginx's default port
EXPOSE 4200

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
