#!/bin/sh
set -e

export FLASK_APP="${FLASK_APP:-app.py}"
MAX_RETRIES=${DB_MAX_RETRIES:-5}
SLEEP_SECONDS=${DB_RETRY_DELAY:-3}

attempt=1
echo "Applying database migrations (max ${MAX_RETRIES} attempts)..."
while [ $attempt -le $MAX_RETRIES ]; do
    if python -m flask db upgrade; then
        echo "Database migrations applied."
        break
    fi

    if [ $attempt -eq $MAX_RETRIES ]; then
        echo "Database migration failed after ${MAX_RETRIES} attempts." >&2
        exit 1
    fi

    attempt=$((attempt + 1))
    echo "Retrying in ${SLEEP_SECONDS} seconds (attempt ${attempt}/${MAX_RETRIES})..."
    sleep "$SLEEP_SECONDS"
done

echo "Starting gunicorn..."
exec gunicorn "app:app" --workers "${WORKERS:-2}" --threads "${THREADS:-8}" --preload --bind "0.0.0.0:${PORT:-8000}"
