# AI Assistance Disclosure:
# Tool: ChatGPT date: 2026‑03‑23
# Scope: Generate initial dockerfile for collaboration service
# Author review: Kept as is as it works

FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/index.js"]