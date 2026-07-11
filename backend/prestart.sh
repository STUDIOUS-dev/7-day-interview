#!/usr/bin/env bash
# prestart.sh — runs before the application starts.
# Executes Alembic migrations automatically on every deploy.
set -euo pipefail

echo "Running database migrations..."
alembic upgrade head
echo "Migrations complete."
