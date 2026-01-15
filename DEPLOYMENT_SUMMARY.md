# Vercel 部署配置完成 ✅

## 📦 已配置的文件

### 1. vercel.json
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### 2. 部署脚本
- `deploy.sh` - macOS/Linux 部署脚本
- `deploy.bat` - Windows 部署脚本

### 3. 文档
- `DEPLOYMENT.md` - 详细部署指南
- `QUICK_DEPLOY.md` - 快速部署指南

### 4. .gitignore
已更新，确保 `.env.local` 不会被提交

---

## 🚀 三种部署方式

### 方式一：GitHub 自动部署（最简单）

```bash
# 1. 推送代码到 GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <你的仓库地址>
git push -u origin main

# 2. 在 Vercel 导入项目
# 访问 vercel.com → Add New Project → 选择你的仓库

# 3. 配置环境变量
# NEXT_PUBLIC_GEMINI_API_KEY = 你的 API Key

# 4. 点击 Deploy
```

### 方式二：使用部署脚本

```bash
# macOS/Linux
./deploy.sh

# Windows
deploy.bat
```

### 方式三：Vercel CLI

```bash
npm install -g vercel
vercel login
vercel              # 预览部署
vercel --prod       # 生产部署
```

---

## ⚙️ 环境变量配置

在 Vercel Dashboard 配置以下环境变量：

**必须配置：**
```
NEXT_PUBLIC_GEMINI_API_KEY=你的 Gemini API Key
```

**可选配置：**
```
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_DEFAULT_GENERATION_COUNT=4
```

---

## 📋 部署检查清单

- [x] package.json 构建脚本正确
- [x] vercel.json 配置完成
- [x] API 路由优化（请求体大小检查、超时设置）
- [x] .gitignore 更新（防止提交 .env.local）
- [x] 本地构建成功 (`npm run build`)
- [ ] 代码推送到 GitHub
- [ ] 在 Vercel 配置环境变量
- [ ] 部署到 Vercel

---

## 🎯 Vercel 限制说明

### 免费版
- ✅ 每月 100GB 带宽
- ✅ 无限次部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ⚠️ 请求体最大 4.5MB
- ⚠️ 函数执行最长时间 10 秒（免费版）/ 60 秒（Pro）

### 项目适配
1. **请求体限制**: 已在 API 中检查，超过 4MB 返回错误
2. **超时设置**: 已设置 `maxDuration = 60`
3. **生成数量**: 限制一次最多生成 4 张

---

## 🔧 API 优化

已在 `app/api/generate/route.ts` 中添加：

```typescript
// 最大执行时间
export const maxDuration = 60;

// 生成数量限制
if (count > 4) {
  return NextResponse.json(
    { success: false, error: '一次最多生成 4 张图片' },
    { status: 400 }
  );
}

// 请求体大小检查
const bodySize = JSON.stringify(body).length;
if (bodySize > 4 * 1024 * 1024) {
  return NextResponse.json(
    { success: false, error: '请求数据过大' },
    { status: 413 }
  );
}
```

---

## 📚 详细文档

- **QUICK_DEPLOY.md** - 快速部署指南（推荐先看这个）
- **DEPLOYMENT.md** - 完整部署文档
- **README.md** - 项目说明

---

## ✨ 部署后测试

部署完成后测试：

1. 访问部署的 URL
2. 上传产品图
3. 输入 prompt（可选）
4. 点击生成
5. 检查生成结果
6. 测试下载功能

---

## 🎉 准备好了吗？

选择一种方式开始部署：

**最推荐：GitHub 自动部署**
```bash
git init
git add .
git commit -m "Ready to deploy"
git remote add origin <你的仓库>
git push -u origin main
```

然后在 Vercel 导入项目即可！

**需要帮助？** 查看 `QUICK_DEPLOY.md` 或 `DEPLOYMENT.md`
