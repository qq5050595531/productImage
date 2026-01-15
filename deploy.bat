@echo off
REM Vercel 部署脚本 (Windows)
REM 使用方法: deploy.bat

echo 🚀 开始部署到 Vercel...
echo.

REM 检查是否安装了 Vercel CLI
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未找到 Vercel CLI
    echo 正在安装 Vercel CLI...
    npm install -g vercel
)

REM 检查是否已登录
echo 📋 检查登录状态...
vercel whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 需要登录 Vercel...
    vercel login
)

REM 本地构建测试
echo 🔨 本地构建测试...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ 本地构建成功
) else (
    echo ❌ 本地构建失败，请修复错误后重试
    pause
    exit /b 1
)

echo.
echo 📦 部署到 Vercel...
echo.

REM 部署
vercel

echo.
echo ✅ 部署成功！
echo.
echo ⚠️  记得在 Vercel Dashboard 配置以下环境变量:
echo    NEXT_PUBLIC_GEMINI_API_KEY
echo.
echo 🌍 预览 URL 已显示在上方
echo.
echo 部署到生产环境? 运行: vercel --prod
pause
