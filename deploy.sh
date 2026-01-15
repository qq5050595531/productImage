#!/bin/bash

# Vercel 部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署到 Vercel..."
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ 未找到 Vercel CLI"
    echo "正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
echo "📋 检查登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "需要登录 Vercel..."
    vercel login
fi

# 本地构建测试
echo "🔨 本地构建测试..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 本地构建成功"
else
    echo "❌ 本地构建失败，请修复错误后重试"
    exit 1
fi

echo ""
echo "📦 部署到 Vercel..."
echo ""

# 部署到预览环境
vercel

echo ""
echo "✅ 部署成功！"
echo ""
echo "⚠️  记得在 Vercel Dashboard 配置以下环境变量:"
echo "   NEXT_PUBLIC_GEMINI_API_KEY"
echo ""
echo "🌍 预览 URL 已显示在上方"
echo ""
echo "部署到生产环境? 运行: vercel --prod"
