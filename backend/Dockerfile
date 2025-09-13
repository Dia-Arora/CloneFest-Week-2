# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install ALL dependencies based on the package-lock.json we fixed
COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Generate the client and build the app
RUN npx prisma generate
RUN npm run build

# Make sure the entrypoint is executable
RUN chmod +x ./entrypoint.sh

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Add openssl, which Prisma's query engine needs
RUN apk add --no-cache openssl

# --- THIS IS THE NEW, SIMPLER STRATEGY ---
# Copy the entire, working node_modules folder from the builder.
# This includes all deps AND the generated Prisma client.
# This is less optimized for size, but 100% reliable.
COPY --from=builder /app/node_modules ./node_modules
# --- END OF NEW STRATEGY ---

# Copy all other necessary artifacts from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/entrypoint.sh .

# Create storage dir for the persistent disk
RUN mkdir -p storage/images

EXPOSE 3000

# This entrypoint and command stay the same
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "start"]