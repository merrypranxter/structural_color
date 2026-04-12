# Dockerfile for Structural Color Engine
# Multi-stage build for development and production

# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# ==========================================
# Stage 2: Development
# ==========================================
FROM node:20-alpine AS development

WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# ==========================================
# Stage 3: Build
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build for production
RUN npm run build

# ==========================================
# Stage 4: Production
# ==========================================
FROM nginx:alpine AS production

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
