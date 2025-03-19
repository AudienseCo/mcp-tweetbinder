# Use an official Node.js runtime as the base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package.json package-lock.json ./

# Install dependencies (ignoring scripts to avoid running them yet)
RUN npm install --ignore-scripts

# Copy the rest of the application code
COPY src ./src
COPY tsconfig.json ./

# Build the TypeScript code
RUN npm run build

# Use a lighter weight image for running the application
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built code and node_modules from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Environment variables (should be replaced with actual credentials in production)
ENV TWEETBINDER_API_TOKEN=your_client_id_here

# Run the application
CMD ["node", "build/index.js"]
