# 快速启动指南

## 项目状态

✅ 项目已成功构建
✅ 开发服务器运行中: http://localhost:3000

## 下一步

### 1. 配置 Gemini API Key

创建 `.env.local` 文件并添加你的 API Key:

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 并填入你的 API Key:
```env
NEXT_PUBLIC_GEMINI_API_KEY=你的实际API密钥
```

获取 API Key: https://makersuite.google.com/app/apikey

### 2. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### 3. 开始使用

1. 打开浏览器访问 http://localhost:3000
2. 上传产品图（必填）
3. 可选上传模特图和参考图
4. 点击"生成产品图"按钮
5. 等待 AI 生成完成
6. 下载生成的图片

## 项目结构总览

```
nanobanana/
├── app/                      # Next.js App Router
│   ├── api/generate/route.ts # 图片生成 API
│   ├── page.tsx              # 主页面
│   └── layout.tsx            # 根布局
├── components/               # React 组件
│   ├── generation/           # 生成组件
│   ├── upload/               # 上传组件
│   └── ui/                   # UI 基础组件
├── lib/                      # 工具库
│   ├── gemini/               # Gemini API 集成
│   ├── hooks/                # 自定义 Hooks
│   ├── store/                # Zustand 状态管理
│   ├── types/                # TypeScript 类型
│   └── utils/                # 工具函数
└── .env.local.example        # 环境变量模板
```

## 可用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 运行代码检查
```

## 功能特性

- ✅ 多类型图片上传（产品图、模特图、参考图）
- ✅ 拖拽上传支持
- ✅ 图片预览和验证
- ✅ AI 生成产品图
- ✅ 实时进度显示
- ✅ 单张/批量下载
- ✅ 重新生成功能
- ✅ 创意动画效果

## 注意事项

1. **API Key**: 必须配置 Gemini API Key 才能使用生成功能
2. **图片限制**: 单张图片最大 10MB，支持 JPEG、PNG、WebP 格式
3. **临时存储**: 生成的图片不持久化，刷新页面后需要重新生成
4. **浏览器兼容**: 建议使用最新版本的 Chrome、Firefox 或 Safari
