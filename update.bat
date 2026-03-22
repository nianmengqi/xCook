@echo off
chcp 65001 > nul
REM =====================================================
REM xCook Docker 更新脚本 (Windows)
REM =====================================================

echo ===========================================
echo        xCook Docker 更新脚本
echo ===========================================
echo.

REM 检查容器是否存在
docker ps -a --format "{{.Names}}" | findstr /C:"xcook" > nul
if %errorlevel% neq 0 (
    echo 错误: 容器 'xcook' 不存在
    pause
    exit /b 1
)

echo ✓ 检查完成，开始更新...
echo.

REM 获取端口映射
for /f "tokens=*" %%i in ('docker inspect xcook --format "^>{{range $p, $conf := .NetworkSettings.Ports}}{{range $conf}}{{.HostPort}}{{end}}{{end}}^<"') do set CURRENT_PORT=%%i
if "%CURRENT_PORT%"=="" set CURRENT_PORT=3000

echo 当前端口: %CURRENT_PORT%
echo.

REM 获取环境变量
for /f "tokens=*" %%i in ('docker inspect xcook --format "^>{{range .Config.Env}}{{if eq (index (splitN . "=" 1) 0) "ADMIN_PASSWORD"}}{{.}}{{end}}{{end}}^<"') do set ADMIN_PASSWORD=%%i
if "%ADMIN_PASSWORD%"=="" set ADMIN_PASSWORD=admin123

echo 管理员密码: %ADMIN_PASSWORD%
echo.

echo ===========================================
echo 警告: 即将更新容器，数据卷将被保留
echo ===========================================
echo.

set /p confirm="确认更新? (y/n): "
if /i not "%confirm%"=="y" (
    echo 取消更新
    pause
    exit /b 0
)

echo.
echo 开始更新...
echo.

echo 1. 停止旧容器...
docker stop xcook

echo 2. 删除旧容器（数据卷保留）...
docker rm xcook

echo 3. 启动新容器...
docker run -d --name xcook -p %CURRENT_PORT%:3000 -v xcook-data:/app/server/data -v xcook-uploads:/app/server/uploads -e NODE_ENV=production -e PORT=3000 -e ADMIN_PASSWORD=%ADMIN_PASSWORD% -e CORS_ORIGINS=* --restart unless-stopped xcook:latest

echo.
echo 4. 检查容器状态...
timeout /t 3 /nobreak > nul

docker ps --format "{{.Names}}" | findstr /C:"xcook" > nul
if %errorlevel% equ 0 (
    echo.
    echo ===========================================
    echo        ✓ 更新成功！
    echo ===========================================
    echo.
    echo 访问地址: http://localhost:%CURRENT_PORT%
    echo 数据卷状态: xcook-data 和 xcook-uploads 已保留
    echo.
    echo 查看日志: docker logs xcook
    echo.
) else (
    echo.
    echo 错误: 容器启动失败，请检查日志
    echo docker logs xcook
)

pause
