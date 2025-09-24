# backend/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copy dependency list (works whether build context is repo root or backend/)
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir gunicorn

# Copy backend application source
COPY backend/ ./

# Optional: Dockerfile-level healthcheck (Railway can also use service healthchecks)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["python", "-c", "import os, socket; socket.create_connection(('127.0.0.1', int(os.environ.get('PORT', '8000'))), timeout=2).close()"]

# Railway sets $PORT. Bind to it.
CMD ["sh", "-c", "gunicorn 'app:app' --workers 2 --threads 8 --preload --bind 0.0.0.0:${PORT:-8000}"]
