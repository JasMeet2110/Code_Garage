# ---- Development Dockerfile with Hot Reload ----
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port for Next.js
EXPOSE 3000

# Enable Next.js hot reload
ENV WATCHPACK_POLLING=true

# Run development server
CMD ["npm", "run", "dev"]
