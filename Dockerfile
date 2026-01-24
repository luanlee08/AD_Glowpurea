# ===== BUILD STAGE =====
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ===== PRODUCTION STAGE =====
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/.env.production .env.production

EXPOSE 3000
CMD ["npm", "start"]
