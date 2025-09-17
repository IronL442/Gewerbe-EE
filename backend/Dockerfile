# backend/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir gunicorn

COPY . .

# Optional: Dockerfile-level healthcheck (Railway can also use service healthchecks)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD python - <<'PY' || exit 1
import os, socket
s=socket.socket(); s.settimeout(2)
try:
    s.connect(("127.0.0.1", int(os.environ.get("PORT","8000")))); s.close(); exit(0)
except Exception: exit(1)
PY

# Railway sets $PORT. Bind to it.
CMD ["sh", "-c", "gunicorn 'app:app' --workers 2 --threads 8 --preload --bind 0.0.0.0:${PORT:-8000}"]