#!/bin/bash

# =====================================================
# xCook 一键部署脚本
# =====================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 默认配置
DEFAULT_PORT=3000
DEFAULT_PASSWORD=xcook123456

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}       xCook 一键部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    exit 1
fi

# 创建 .env 文件
create_env() {
    echo -e "${YELLOW}创建配置文件...${NC}"
    
    cat > .env << EOF
# ==================== 基础配置 ====================
PORT=${PORT}

# ==================== 安全配置 ====================
JWT_SECRET=
ADMIN_PASSWORD=${ADMIN_PASSWORD}

# ==================== 跨域配置 ====================
CORS_ORIGINS=*
EOF
    echo -e "${GREEN}✓ 配置文件已创建: .env${NC}"
}

# 生成 JWT 密钥
generate_jwt() {
    if grep -q "^JWT_SECRET=$" .env; then
        JWT=$(openssl rand -hex 64)
        sed -i "s/^JWT_SECRET=$/JWT_SECRET=$JWT/" .env
        echo -e "${GREEN}✓ JWT 密钥已自动生成${NC}"
    else
        echo -e "${YELLOW}⚠ JWT 密钥已配置，跳过生成${NC}"
    fi
}

# 拉取最新代码
pull_code() {
    if [ -d ".git" ]; then
        echo -e "${YELLOW}拉取最新代码...${NC}"
        git pull origin main
        echo -e "${GREEN}✓ 代码已更新${NC}"
    else
        echo -e "${YELLOW}⚠ 非 Git 仓库，跳过代码更新${NC}"
    fi
}

# 构建并启动
deploy() {
    echo -e "${YELLOW}构建 Docker 镜像...${NC}"
    docker-compose build --no-cache
    
    echo -e "${YELLOW}启动容器...${NC}"
    docker-compose up -d
    
    echo -e "${YELLOW}等待服务启动...${NC}"
    sleep 5
    
    # 检查容器状态
    if docker-compose ps | grep -q "Up"; then
        echo -e "${GREEN}✓ 服务启动成功！${NC}"
    else
        echo -e "${RED}✗ 服务启动失败，请检查日志${NC}"
        docker-compose logs
        exit 1
    fi
}

# 显示部署信息
show_info() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}       部署完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "访问地址: ${YELLOW}http://localhost:${PORT}${NC}"
    echo ""
    echo -e "配置信息:"
    echo -e "  - 端口: ${PORT}"
    echo -e "  - 管理员密码: ${ADMIN_PASSWORD}"
    echo ""
    echo -e "常用命令:"
    echo -e "  - 查看日志: ${YELLOW}docker-compose logs -f${NC}"
    echo -e "  - 停止服务: ${YELLOW}docker-compose down${NC}"
    echo -e "  - 重启服务: ${YELLOW}docker-compose restart${NC}"
    echo ""
}

# 主流程
main() {
    # 解析命令行参数
    while getopts "p:P:h" opt; do
        case $opt in
            p|P)
                PORT="$OPTARG"
                ;;
            h)
                echo "用法: $0 [-p 端口] [-P 密码]"
                echo "  -p: 指定端口 (默认: $DEFAULT_PORT)"
                echo "  -P: 指定管理员密码 (默认: $DEFAULT_PASSWORD)"
                exit 0
                ;;
            \?)
                exit 1
                ;;
        esac
    done
    
    PORT=${PORT:-$DEFAULT_PORT}
    ADMIN_PASSWORD=${ADMIN_PASSWORD:-$DEFAULT_PASSWORD}
    
    # 执行部署流程
    if [ ! -f .env ]; then
        create_env
    else
        echo -e "${YELLOW}使用现有配置文件${NC}"
    fi
    
    generate_jwt
    pull_code
    deploy
    show_info
}

main "$@"
