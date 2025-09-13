# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# --- FIX ADDED HERE in previous step ---
RUN chmod +x -R ./node_modules/.bin/

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript code
RUN ./node_modules/.bin/tsc

# Stage 2: Production
FROM node:18-alpine

# ---> ADD THE NEW FIX HERE <---
# Install OpenSSL, which Prisma needs to run on Alpine Linux
RUN apk add --no-cache openssl

WORKDIR /app

# Copy production dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create the storage directory
RUN mkdir -p storage/images

EXPOSE 3000

CMD ["npm", "start"]