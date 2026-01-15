# API Key 检测问题修复

## 问题描述
保存 API Key 后，生成按钮仍然不可点击。

## 修复内容

### 1. 添加自定义事件机制
- 文件：`lib/hooks/useApiKey.ts`
- 添加 `api-key-changed` 自定义事件监听
- 当 API Key 保存或删除时触发事件

### 2. 更新 ApiKeyInput 组件
- 文件：`components/ui/ApiKeyInput.tsx`
- 保存后触发 `window.dispatchEvent(new Event('api-key-changed'))`
- 清除后也触发事件

## 测试步骤

1. **刷新页面**
   ```
   打开 http://localhost:3000
   按 Ctrl+R (或 Cmd+R) 刷新页面
   ```

2. **重新配置 API Key**
   - 在 "Gemini API Key" 输入框中粘贴你的 Key
   - 点击 "保存 API Key"
   - 看到"已保存"提示

3. **上传产品图**
   - 点击产品图区域
   - 选择一张图片上传

4. **验证生成按钮**
   - 检查"生成产品图"按钮是否变为可点击状态
   - 按钮应该从灰色变为紫色渐变

## 如果仍然不可点击

### 检查浏览器控制台

1. 打开浏览器开发者工具 (F12)
2. 切换到 Console 标签
3. 查看是否有错误信息

### 手动检查 localStorage

1. 打开浏览器控制台
2. 输入以下命令：
   ```javascript
   localStorage.getItem('gemini_api_key')
   ```
3. 应该返回你的 API Key（以 AIza 开头）

### 清除并重新配置

1. 点击 API Key 输入框的"清除"按钮
2. 重新输入并保存
3. 刷新页面

## 技术细节

### 事件流

```
用户保存 API Key
    ↓
ApiKeyInput.handleSave()
    ↓
localStorage.setItem('gemini_api_key', key)
    ↓
window.dispatchEvent(new Event('api-key-changed'))
    ↓
useApiKey hook 检测到事件
    ↓
调用 checkApiKey()
    ↓
更新 isConfigured 状态
    ↓
主页面的 canGenerate 重新计算
    ↓
生成按钮变为可用
```

### 状态依赖

```typescript
// 主页面
const { isConfigured } = useApiKey();
const canGenerate = hasImages && isConfigured;

// PromptInput 组件
disabled={!canGenerate || isGenerating}
```

## 开发者注意

如果需要调试，可以在浏览器控制台运行：

```javascript
// 检查 API Key 是否已保存
localStorage.getItem('gemini_api_key')

// 手动触发更新事件
window.dispatchEvent(new Event('api-key-changed'))

// 检查页面状态
document.querySelector('[disabled]')
```

## 已知限制

1. SSR 阶段无法访问 localStorage（正常现象）
2. 需要在客户端（浏览器）中配置
3. 隐私模式下可能无法持久化

## 后续改进建议

- [ ] 添加配置状态实时指示器
- [ ] 支持 API Key 验证（调用 API 测试）
- [ ] 添加使用量统计显示
- [ ] 支持多个 API Key 管理
