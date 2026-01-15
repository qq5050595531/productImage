# Vercel 快速部署指南

## 方式一：GitHub 自动部署（推荐）⭐

### 步骤 1: 推送代码到 GitHub

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Initial commit"

# 4. 创建 GitHub 仓库后，添加远程地址
git remote add origin https://github.com/你的用户名/nanobanana.git

# 5. 推送代码
git push -u origin main
```

### 步骤 2: 在 Vercel 部署

1. 访问 **https://vercel.com**
2. 点击 **"Add New..."** → **"Project"**
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测 Next.js 项目

### 步骤 3: 配置环境变量

在 Vercel 项目设置的 **Environment Variables** 中添加：

```
NEXT_PUBLIC_GEMINI_API_KEY = 你的 Gemini API Key
```

获取 API Key: https://makersuite.google.com/app/apikey

### 步骤 4: 部署

点击 **"Deploy"** 按钮，等待部署完成（约 1-2 分钟）

---

## 方式二：使用部署脚本

### macOS / Linux

```bash
./deploy.sh
```

### Windows

```bash
deploy.bat
```

脚本会自动：
- 检查并安装 Vercel CLI
- 本地构建测试
- 部署到 Vercel 预览环境

---

## 方式三：Vercel CLI 手动部署

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录

```bash
vercel login
```

### 3. 部署

```bash
# 预览部署
vercel

# 生产部署
vercel --prod
```

---

## 部署后配置

### ⚠️ 重要：设置环境变量

在 Vercel Dashboard 中添加环境变量：

**路径**: Project → Settings → Environment Variables

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | 你的 API Key | Production, Preview, Development |

添加后需要重新部署！

---

## 配置说明

### vercel.json

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  },
  "regions": ["sin1"]
}
```

- **maxDuration**: 60 秒（图片生成需要时间）
- **regions**: sin1 (新加坡)，可选：
  - `hnd1` - 日本东京
  - `sfo1` - 美国旧金山
  - `iad1` - 美国弗吉尼亚

---

## Vercel 限制说明

### 免费版限制

- ✅ 每月 100GB 带宽
- ✅ 无限次部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ⚠️ 请求体最大 4.5MB
- ⚠️ 函数执行最长时间 60 秒（Pro 版）

### 本项目的适配

1. **请求体大小**: 已在 API 中检查，超过 4MB 会返回错误
2. **执行时间**: 已设置 maxDuration = 60
3. **生成数量**: 限制一次最多生成 4 张图片

---

## 部署检查清单

部署前确认：

- [x] 代码已推送到 GitHub
- [x] `.env.local` 未提交到 Git
- [x] 本地构建成功 (`npm run build`)
- [ ] 环境变量已在 Vercel 配置
- [ ] API Key 已添加到环境变量

---

## 测试部署

部署完成后：

1. 访问 Vercel 提供的 URL
2. 测试图片上传
3. 测试 AI 生成（需要 API Key）
4. 测试图片下载
5. 检查控制台错误

---

## 常见问题

### Q: 构建失败怎么办？

A: 检查构建日志，常见原因：
- TypeScript 类型错误
- 依赖安装失败
- 环境变量未配置

### Q: API 超时怎么办？

A:
- 已设置 maxDuration = 60
- 如果仍超时，考虑：
  - 减少生成数量
  - 压缩图片大小
  - 升级到 Vercel Pro

### Q: 图片上传失败？

A:
- 检查图片大小（建议 < 2MB）
- 检查图片格式（JPEG/PNG/WebP）
- Vercel 免费版请求体限制 4.5MB

### Q: 如何更新部署？

A:
```bash
git add .
git commit -m "Update"
git push
```
Vercel 会自动部署最新的代码。

---

## 自定义域名

### 1. 添加域名

在 Vercel 项目中：Settings → Domains → Add Domain

### 2. 配置 DNS

```
类型: CNAME
名称: www (或 @)
值: cname.vercel-dns.com
```

### 3. 等待验证

通常 5-10 分钟生效

---

## 监控和分析

### Vercel Dashboard

- 访问量统计
- 函数执行时间
- 错误日志
- 性能指标

### 设置通知

Settings → Notifications → 配置邮件或 Slack 通知

---

## 成本

### 免费版（适合个人项目）

- ✅ 无限次部署
- ✅ 100GB 带宽/月
- ✅ 全球 CDN
- ✅ 自动 HTTPS
- ✅ GitHub 集成

### Pro 版（$20/月）

- 1TB 带宽
- 更长函数执行时间
- 团队协作
- 优先支持

对于个人或小规模使用，**免费版已完全够用**。

---

## 下一步

部署成功后：

1. 🎉 分享你的应用链接
2. 📊 查看 Vercel Analytics（可选）
3. 🔔 配置错误通知
4. 🌐 设置自定义域名（可选）
5. 📝 完善文档

---

## 需要帮助？

- **Vercel 文档**: https://vercel.com/docs
- **Next.js 部署**: https://nextjs.org/docs/deployment
- **Gemini API**: https://ai.google.dev/docs

祝部署顺利！🚀
