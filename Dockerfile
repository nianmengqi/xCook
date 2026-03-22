# xCook Dockerfile
# 多阶段构建，优化镜像大小

# 阶段1: 构建前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# 阶段2: 构建后端
FROM node:18-alpine AS backend-builder

WORKDIR /app/server

COPY server/package*.json ./

RUN npm ci

COPY server/ ./

RUN npm run build

# 阶段3: 生产镜像
FROM node:18-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/package.json ./server/

COPY --from=frontend-builder /app/dist ./dist

RUN mkdir -p /app/server/data /app/server/uploads /app/server/logs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'if [ -z "$JWT_SECRET" ]; then' >> /app/start.sh && \
    echo '  JWT_SECRET=$(openssl rand -hex 64)' >> /app/start.sh && \
    echo '  echo "Generated JWT_SECRET: $JWT_SECRET"' >> /app/start.sh && \
    echo '  export JWT_SECRET' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'cd /app/server && node dist/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
