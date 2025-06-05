# Stage 1: Build the application
FROM oven/bun:1-alpine AS build

WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies using bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the application
# (Assuming your build script is named 'build' in package.json)
RUN bun run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]