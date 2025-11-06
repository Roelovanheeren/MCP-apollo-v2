FROM node:22.12-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine AS release

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/verify.js ./verify.js

ENV NODE_ENV=production

RUN npm ci --ignore-scripts --omit-dev

EXPOSE 8080

CMD ["sh", "-c", "node verify.js & AUTH_SERVER_URL=http://127.0.0.1:9090/verify PORT=${PORT:-8080} mcp-proxy-auth node dist/index.js"]
