# NanoBanana - 产品图生成器

一个基于 AI 的产品图生成应用，使用 Google Gemini 2.5 Flash Image 模型生成创意产品图。

## 功能特性

- 📷 **多类型图片上传**: 支持产品图、模特图和参考图上传
- 🤖 **AI 生成**: 使用 Gemini 2.5 Flash Image 模型生成高质量产品图
- ✍️ **自定义Prompt**: 灵活的文本描述和预设模板
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

### 2. 获取 Gemini API Key

访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取免费的 API Key

### 3. 运行开发服务器

```bash
npm run dev
```

### 4. 配置 API Key

打开 [http://localhost:3000](http://localhost:3000)，在页面顶部的输入框中粘贴你的 Gemini API Key

**注意**：API Key 仅保存在浏览器本地，不会上传到服务器，完全安全！

### 5. 构建生产版本（可选）

```bash
npm run build
npm start
```

## 使用说明

1. **配置 API Key**: 在首页输入框中粘贴你的 Gemini API Key
2. **上传产品图**: 至少上传一张产品图片（必填）
3. **上传模特图**: 可选，上传模特或场景图片
4. **上传参考图**: 可选，上传风格参考图片
5. **生成图片**: 点击"生成产品图"按钮
6. **下载结果**: 单张下载或批量下载生成的图片

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

## 注意事项

1. **API Key 配置**: 直接在界面上配置 API Key，保存在浏览器本地
2. **图片大小**: 单张图片最大 10MB
3. **图片格式**: 支持 JPEG、PNG、WebP 格式
4. **临时存储**: 生成的图片不持久化存储，刷新页面后丢失

## 许可证

MIT
