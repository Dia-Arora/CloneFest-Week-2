# Stage 1: Builder
# We are now using "slim" (Debian) instead of "alpine"
FROM node:18-slim AS builder
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
# We are also using "slim" here for the final image
FROM node:18-slim
WORKDIR /app

# --- THIS IS THE FIX ---
# This is the Debian/Ubuntu command to install openssl
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
# --- END OF FIX ---

# Copy the package.json file for the "npm start" command
COPY --from=builder /app/package*.json ./

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