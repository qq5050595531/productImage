# NanoBanana - 产品图生成器

一个基于 AI 的产品图生成应用，使用 Google Gemini 2.5 Flash Image 模型生成创意产品图。

## 功能特性

- 📷 **多类型图片上传**: 支持产品图、模特图和参考图上传
- 🤖 **AI 生成**: 使用 Gemini 2.5 Flash Image 模型生成高质量产品图
- 🎨 **创意视觉效果**: 精美的渐变色彩和动画效果
- 📥 **批量下载**: 支持单张或批量下载生成的图片
- 🔄 **重新生成**: 一键重新生成，无需重新上传
- ⚡ **实时进度**: 显示生成进度和当前状态

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS + Framer Motion
- **状态管理**: Zustand
- **图片上传**: React Dropzone
- **AI 模型**: Google Gemini 2.5 Flash Image
- **图片处理**: JSZip (批量下载)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 到 `.env.local` 并配置你的 Gemini API Key:

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

获取 API Key: https://makersuite.google.com/app/apikey

### 3. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 使用说明

1. **上传产品图**: 至少上传一张产品图片（必填）
2. **上传模特图**: 可选，上传模特或场景图片
3. **上传参考图**: 可选，上传风格参考图片
4. **生成图片**: 点击"生成产品图"按钮
5. **下载结果**: 单张下载或批量下载生成的图片

## 项目结构

```
nanobanana/
├── app/                      # Next.js App Router
│   ├── api/generate/         # 图片生成 API
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── components/               # React 组件
│   ├── generation/           # 生成相关组件
│   ├── upload/               # 上传组件
│   └── ui/                   # UI 基础组件
├── lib/                      # 工具库
│   ├── gemini/               # Gemini API 封装
│   ├── hooks/                # 自定义 Hooks
│   ├── store/                # Zustand 状态管理
│   ├── types/                # TypeScript 类型
│   └── utils/                # 工具函数
└── public/                   # 静态资源
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Gemini API 密钥 | 必填 |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | 单张图片最大大小（字节） | 10485760 (10MB) |
| `NEXT_PUBLIC_DEFAULT_GENERATION_COUNT` | 默认生成图片数量 | 4 |

## 注意事项

1. **API Key 安全**: 请勿将 `.env.local` 提交到 Git
2. **图片大小**: 单张图片最大 10MB
3. **图片格式**: 支持 JPEG、PNG、WebP 格式
4. **临时存储**: 生成的图片不持久化存储，刷新页面后丢失

## 许可证

MIT
