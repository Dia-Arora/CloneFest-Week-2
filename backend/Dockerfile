# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install ALL dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate client and build the app
RUN npx prisma generate
RUN npm run build

# Make sure the entrypoint is executable
RUN chmod +x ./entrypoint.sh

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Add openssl, which Prisma's query engine needs
RUN apk add --no-cache openssl

# --- THIS IS THE FIX ---
# We must copy the package.json (and package-lock) so that
# the "npm start" command can find its script.
COPY --from=builder /app/package*.json ./
# --- END OF FIX ---

# Copy the entire working node_modules folder
COPY --from=builder /app/node_modules ./node_modules

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