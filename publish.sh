#!/bin/bash

# =====================================================
# xCook 发布到 Docker Hub 脚本
# =====================================================

set -e

echo "========================================="
echo "       xCook 发布到 Docker Hub"
echo "========================================="
echo ""

# 检查 Docker Hub 用户名
if [ -z "$1" ]; then
    echo "用法: ./publish.sh <docker-hub-用户名>"
    echo "示例: ./publish.sh yourusername"
    exit 1
fi

DOCKER_USER=$1
IMAGE_NAME="xcook"
FULL_IMAGE_NAME="${DOCKER_USER}/${IMAGE_NAME}:latest"

echo "Docker Hub 用户名: $DOCKER_USER"
echo "镜像名称: $FULL_IMAGE_NAME"
echo ""

# 登录 Docker Hub
echo "请登录 Docker Hub..."
docker login

# 构建镜像
echo ""
echo "构建镜像..."
docker build -t $FULL_IMAGE_NAME .

# 推送镜像
echo ""
echo "推送镜像到 Docker Hub..."
docker push $FULL_IMAGE_NAME

echo ""
echo "========================================="
echo "       发布成功！"
echo "========================================="
echo ""
echo "镜像地址: $FULL_IMAGE_NAME"
echo ""
echo "用户部署命令:"
echo "  docker run -d \\"
echo "    --name xcook \\"
echo "    -p 3000:3000 \\"
echo "    -e ADMIN_PASSWORD=your-password \\"
echo "    $FULL_IMAGE_NAME"
echo ""
