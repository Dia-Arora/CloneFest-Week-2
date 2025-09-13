# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN chmod +x -R ./node_modules/.bin/
COPY . .
RUN npx prisma generate
RUN ./node_modules/.bin/tsc

# Stage 2: Production
FROM node:18-alpine

RUN apk add --no-cache openssl
WORKDIR /app

# Copy dependencies and build artifacts from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# --- NEW FIX STARTS HERE ---
# Copy the Prisma schema into the final image
COPY --from=builder /app/prisma ./prisma

# Generate the Prisma client INSIDE the final image to ensure it's correct
RUN npx prisma generate
# --- NEW FIX ENDS HERE ---

# Create the storage directory
RUN mkdir -p storage/images

EXPOSE 3000

CMD ["npm", "start"]