# xCook Dockerfile
# 多阶段构建，优化镜像大小

# 阶段1: 构建前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# 复制前端依赖文件
COPY package*.json ./

# 安装前端依赖
RUN npm ci

# 复制前端源码
COPY . .

# 构建前端
RUN npm run build

# 阶段2: 构建后端
FROM node:18-alpine AS backend-builder

WORKDIR /app/server

# 复制后端依赖文件
COPY server/package*.json ./

# 安装后端依赖
RUN npm ci

# 复制后端源码
COPY server/ ./

# 构建后端
RUN npm run build

# 阶段3: 生产镜像
FROM node:18-alpine AS production

WORKDIR /app

# 复制后端构建产物
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/package.json ./server/

# 复制前端构建产物
COPY --from=frontend-builder /app/dist ./dist

# 创建数据目录
RUN mkdir -p /app/server/data /app/server/uploads /app/server/logs

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 创建启动脚本
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/server' >> /app/start.sh && \
    echo 'node dist/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# 启动服务
CMD ["/app/start.sh"]
