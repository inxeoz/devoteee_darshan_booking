# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npx vite build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "build/index.js"]