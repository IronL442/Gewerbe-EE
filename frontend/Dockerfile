# frontend/Dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Serve stage (Caddy)
FROM caddy:2-alpine
WORKDIR /app
# Security headers + port via $PORT
COPY <<'CADDYFILE' /app/Caddyfile
{
  admin off
  persist_config off
  auto_https off
}
:{$PORT:3000} {
  header {
    Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://{env.BACKEND_HOST}"
    Referrer-Policy "strict-origin-when-cross-origin"
  }
  @api path /api/*
  handle @api {
    reverse_proxy backend:8000
  }

  handle {
    root * /app/dist
    encode gzip
    try_files {path} /index.html
    file_server
  }
}
CADDYFILE

COPY --from=build /app/dist /app/dist
CMD ["caddy", "run", "--config", "/app/Caddyfile", "--adapter", "caddyfile"]
