# ============================
# ZGA — Dockerfile unifié (Frontend + API)
# ============================

# --- Étape 1 : Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Étape 2 : Production ---
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./.output

ENV HOST=0.0.0.0
EXPOSE 10000

CMD ["node", ".output/server/index.mjs"]
