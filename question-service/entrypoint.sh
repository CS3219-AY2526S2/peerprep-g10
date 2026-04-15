#!/bin/sh
set -e

echo "Seeding question database..."
node dist/seed.js

echo "Starting question service..."
exec node dist/server.js
