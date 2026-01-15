# Vercel 部署指南

## 自动部署（推荐）

### 1. 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Product Image Generator"

# 推送到 GitHub
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Add New..." → "Project"
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测 Next.js 项目

### 3. 配置环境变量

在 Vercel 项目设置中添加环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | 你的 Gemini API Key | 必填 |

获取 API Key: https://makersuite.google.com/app/apikey

### 4. 部署

点击 "Deploy" 按钮，Vercel 会自动：
- 安装依赖
- 运行构建命令
- 部署到全球 CDN

### 5. 访问你的应用

部署完成后，Vercel 会提供一个 URL（如 `https://nanobanana.vercel.app`）

## 手动部署

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 部署

```bash
# 项目根目录执行
vercel

# 按提示操作：
# - 设置项目名称
# - 关联到现有项目（如果有的话）
# - 配置环境变量
```

### 4. 设置环境变量

在 Vercel Dashboard 或使用 CLI：

```bash
vercel env add NEXT_PUBLIC_GEMINI_API_KEY
```

### 5. 生产部署

```bash
vercel --prod
```

## 环境变量配置

### 必须配置的环境变量

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### 可选环境变量

```env
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_DEFAULT_GENERATION_COUNT=4
```

## 部署配置说明

### vercel.json

项目包含 `vercel.json` 配置文件：

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

**配置说明：**
- `regions`: ["sin1"] - 部署到新加坡区域（可选：hnd1 东京, sfo1 旧金山）
- `maxDuration`: 60 - API 路由最大执行时间 60 秒（适合图片生成）

### 其他可用区域

- `sin1` - 新加坡
- `hnd1` - 日本东京
- `sfo1` - 美国旧金山
- `iad1` - 美国弗吉尼亚

选择离你用户最近的区域以获得最佳性能。

## 常见问题

### 1. 构建失败

**问题**: 部署时构建失败

**解决方案**:
- 检查 package.json 中的构建脚本是否正确
- 确保 TypeScript 类型检查通过
- 查看构建日志中的错误信息

### 2. API 超时

**问题**: 图片生成超时

**解决方案**:
- 已在 vercel.json 中设置 `maxDuration: 60`
- 如果仍超时，考虑优化 API 逻辑或使用其他部署方式

### 3. 环境变量未生效

**问题**: API Key 未生效

**解决方案**:
- 确保变量名以 `NEXT_PUBLIC_` 开头
- 在 Vercel Dashboard 中重新部署
- 清除浏览器缓存

### 4. 图片上传失败

**问题**: 大文件上传失败

**解决方案**:
- Vercel Serverless Functions 有 4.5MB 请求体限制
- 考虑使用 Vercel Blob 或其他存储服务
- 或限制图片大小（当前设置为 10MB）

## 性能优化建议

1. **使用 Vercel Analytics**
   ```bash
   vercel addons install analytics
   ```

2. **配置 CDN 缓存**
   - 静态资源自动缓存
   - API 响应可通过 Cache-Control 头控制

3. **监控和日志**
   - Vercel Dashboard 提供实时日志
   - 设置错误通知

## 自定义域名

1. 在 Vercel 项目设置中
2. 点击 "Domains"
3. 添加你的域名
4. 配置 DNS 记录

## 更新部署

每次推送到 `main` 分支会自动触发部署：

```bash
git add .
git commit -m "Update"
git push
```

或手动触发：
```bash
vercel --prod
```

## 成本说明

- **Vercel 免费版**:
  - 每月 100GB 带宽
  - 无限次部署
  - 自动 HTTPS
  - 全球 CDN

- **Pro 版** ($20/月):
  - 更高性能
  - 更多带宽
  - 更长函数执行时间

对于个人项目或小规模使用，免费版已足够。

## 检查清单

部署前确认：

- [ ] 代码已推送到 GitHub
- [ ] .env.local 未提交到 Git
- [ ] 环境变量已在 Vercel 配置
- [ ] 构建成功（本地测试 `npm run build`）
- [ ] API 路由正常工作
- [ ] 响应式设计在不同设备测试
- [ ] 自定义域名配置（如需要）

## 部署后测试

1. 访问部署的 URL
2. 测试图片上传功能
3. 测试 AI 生成功能（需要 API Key）
4. 测试下载功能
5. 检查控制台是否有错误

## 支持和帮助

- Vercel 文档: https://vercel.com/docs
- Next.js 部署: https://nextjs.org/docs/deployment
- Gemini API: https://ai.google.dev/docs
