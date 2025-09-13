#!/bin/sh
set -e # Exit immediately if a command fails

echo "Syncing database schema..."
# This command just makes the DB match the schema. Simple.
npx prisma db push

# Start the application
echo "Starting the server..."
node dist/index.js