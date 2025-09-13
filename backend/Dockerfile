# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (incl. devDeps)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Run prisma generate and build the TypeScript code
RUN npx prisma generate
RUN npm run build

# Copy the entrypoint script and make it executable
COPY ./entrypoint.sh .
RUN chmod +x ./entrypoint.sh


# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies (this includes prisma and @prisma/client now)
RUN npm prune --production

# --- THIS IS THE FIX ---
# We must re-run generate to build the client in the new prod node_modules
RUN npx prisma generate
# --- END OF FIX ---

# Copy the built app code, schema, and entrypoint from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/entrypoint.sh .

# Create the storage directory for the persistent disk
RUN mkdir -p storage/images

EXPOSE 3000

# Set the entrypoint to our script
ENTRYPOINT ["./entrypoint.sh"]

# Set the default command for the entrypoint to execute
CMD ["npm", "start"]