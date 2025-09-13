#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Execute the main container command (which will be 'npm start')
echo "Starting the server..."
exec "$@"