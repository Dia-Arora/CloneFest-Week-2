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

# Copy the entrypoint script
COPY ./entrypoint.sh .
RUN chmod +x ./entrypoint.sh


# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies, pruning all devDependencies
RUN npm prune --production

# Copy the necessary built artifacts from the builder stage
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