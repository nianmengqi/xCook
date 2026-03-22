@echo off
chcp 65001 > nul
REM =====================================================
REM xCook 一键部署脚本 (Windows)
REM =====================================================

echo ============================================
echo        xCook 一键部署脚本
echo ============================================
echo.

REM 检查 Docker
where docker > nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Docker 未安装
    pause
    exit /b 1
)

where docker-compose > nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Docker Compose 未安装
    pause
    exit /b 1
)

REM 默认配置
set PORT=3000
set PASSWORD=xcook123456

REM 解析参数
if not "%1"=="" set PORT=%1
if not "%2"=="" set PASSWORD=%2

echo 创建配置文件...
(
echo # xCook 环境配置
echo PORT=%PORT%
echo JWT_SECRET=
echo ADMIN_PASSWORD=%PASSWORD%
echo CORS_ORIGINS=*
) > .env

echo ✓ 配置文件已创建: .env

echo.
echo 生成 JWT 密钥...
docker run --rm -v "%cd%:/app" alpine sh -c "apk add --no-cache openssl > /dev/null 2>&1 && openssl rand -hex 64 >> /app/.env.tmp"
findstr /C:"JWT_SECRET" .env > nul
if %errorlevel% neq 0 (
    echo JWT_SECRET= >> .env
)
set /p JWT_LINE=<.env.tmp
del .env.tmp > nul 2>&1
for /f "tokens=1,* delims==" %%a in ("%JWT_LINE%") do (
    if "%%a"=="JWT_SECRET" (
        sed -i "s/^JWT_SECRET=$/JWT_SECRET=%%b/" .env 2>nul
    )
)
echo ✓ JWT 密钥已生成

echo.
echo 构建 Docker 镜像...
docker-compose build --no-cache

echo.
echo 启动容器...
docker-compose up -d

echo.
echo 等待服务启动...
timeout /t 5 /nobreak > nul

echo.
echo ============================================
echo        部署完成！
echo ============================================
echo.
echo 访问地址: http://localhost:%PORT%
echo.
echo 管理员密码: %PASSWORD%
echo.
echo 常用命令:
echo   查看日志: docker-compose logs -f
echo   停止服务: docker-compose down
echo   重启服务: docker-compose restart
echo.
pause
