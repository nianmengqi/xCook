#!/bin/bash

# =====================================================
# xCook Docker 更新脚本（保留数据）
# =====================================================

set -e

echo "========================================="
echo "       xCook Docker 更新脚本"
echo "========================================="
echo ""

# 检查容器是否存在
if ! docker ps -a --format '{{.Names}}' | grep -q "^xcook$"; then
    echo "错误: 容器 'xcook' 不存在"
    echo "请先使用 docker run 命令创建容器"
    exit 1
fi

# 检查镜像是否存在
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "xcook:latest"; then
    echo "错误: 镜像 'xcook:latest' 不存在"
    echo "请先构建镜像: docker build -t xcook:latest ."
    exit 1
fi

echo "✓ 检查完成，开始更新..."
echo ""

# 显示当前配置
echo "当前容器配置："
docker inspect xcook --format='{{range .Mounts}} {{ .Name }}:{{ .Mountpoint }} {{end}}' 2>/dev/null || true
echo ""

# 获取端口映射
CURRENT_PORT=$(docker inspect xcook --format='{{range $p, $conf := .NetworkSettings.Ports}}{{range $conf}}{{.HostPort}}{{end}}{{end}}' 2>/dev/null | head -1)
if [ -z "$CURRENT_PORT" ]; then
    CURRENT_PORT=3000
fi

echo "当前端口: $CURRENT_PORT"
echo ""

# 获取环境变量
ADMIN_PASSWORD=$(docker inspect xcook --format='{{range .Config.Env}}{{if eq (index (splitN . "=" 1) 0) "ADMIN_PASSWORD"}}{{.}}{{end}}{{end}}' 2>/dev/null | cut -d'=' -f2)
if [ -z "$ADMIN_PASSWORD" ]; then
    ADMIN_PASSWORD="admin123"
fi

echo "管理员密码: $ADMIN_PASSWORD"
echo ""

# 确认操作
echo "========================================="
echo "警告: 即将更新容器，数据卷将被保留"
echo "========================================="
echo ""

read -p "确认更新? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "取消更新"
    exit 0
fi

echo ""
echo "开始更新..."
echo ""

# 停止并删除旧容器（保留数据卷）
echo "1. 停止旧容器..."
docker stop xcook

echo "2. 删除旧容器（数据卷保留）..."
docker rm xcook

echo "3. 启动新容器..."
docker run -d \
    --name xcook \
    -p ${CURRENT_PORT}:3000 \
    -v xcook-data:/app/server/data \
    -v xcook-uploads:/app/server/uploads \
    -e NODE_ENV=production \
    -e ADMIN_PASSWORD=${ADMIN_PASSWORD} \
    -e CORS_ORIGINS=* \
    --restart unless-stopped \
    xcook:latest

echo ""
echo "4. 检查容器状态..."
sleep 3

# 检查容器是否正常运行
if docker ps --format '{{.Names}}' | grep -q "^xcook$"; then
    echo ""
    echo "========================================="
    echo "       ✓ 更新成功！"
    echo "========================================="
    echo ""
    echo "访问地址: http://localhost:${CURRENT_PORT}"
    echo "数据卷状态: xcook-data 和 xcook-uploads 已保留"
    echo ""
    echo "查看日志: docker logs xcook"
    echo ""
else
    echo ""
    echo "错误: 容器启动失败，请检查日志"
    echo "docker logs xcook"
    exit 1
fi
