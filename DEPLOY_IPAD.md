# 在iPad上部署英语学习系统

本指南说明如何在iPad上部署并运行这个英语学习系统。

## 方案1：PWA（推荐，最简单）

### 步骤1：构建PWA版本

```bash
cd client
npm run build:pwa
```

这会生成一个完全优化的PWA应用，可以在iPad上通过浏览器访问并安装为本地应用。

### 步骤2：部署到服务器

将 `client/dist` 文件夹中的文件上传到任何Web服务器（如Vercel、Netlify、GitHub Pages等）。

例如，使用Vercel（免费）：

```bash
npm install -g vercel
cd client
vercel
```

### 步骤3：在iPad上安装

1. 在iPad的Safari浏览器中打开应用链接
2. 点击分享按钮（Share）
3. 点击"添加到主屏幕"（Add to Home Screen）
4. 命名为"英语学习"（或其他名称）
5. 点击"添加"

应用会像原生应用一样显示在主屏幕上，点击即可运行。

## 方案2：使用本地网络（用于测试）

### 步骤1：启动开发服务器

```bash
npm run dev
```

### 步骤2：在iPad上连接

1. 确保iPad和电脑在同一WiFi网络上
2. 获取电脑的IP地址（在Mac上运行 `ipconfig getifaddr en0`）
3. 在iPad的Safari中输入：`http://YOUR_IP:3000`

## 完整部署流程

### 前置条件

- Node.js 16+
- npm 或 yarn
- 一个可以部署的Web服务器或云平台账号

### 部署步骤

1. **本地测试**
   ```bash
   npm run dev
   ```
   访问 http://localhost:3000

2. **生成生产版本**
   ```bash
   npm run build:pwa
   ```
   输出在 `client/dist` 文件夹

3. **启动后端服务器**

   PWA版本需要后端API支持（用于导入单词）。确保后端在 `http://localhost:3001` 或在生产环境中正确配置。

4. **部署到云平台**

   **使用 Vercel（推荐）：**
   ```bash
   npm install -g vercel
   cd client
   vercel --prod
   ```

   **使用 Netlify：**
   ```bash
   npm install -g netlify-cli
   cd client
   netlify deploy --prod --dir=dist
   ```

   **使用 GitHub Pages：**
   编辑 `vite.config.ts` 添加 `base: '/learn-english/'`，然后：
   ```bash
   npm run build
   # 将 dist 文件夹的内容提交到 gh-pages 分支
   ```

## 后端API配置

如果你的后端服务器不在 `http://localhost:3001`，需要更新 API 端点。

编辑 `client/src/` 中的API调用，将 `/api` 替换为你的实际API地址。

例如，如果使用 `example.com`：

```bash
sed -i 's|/api|https://example.com/api|g' src/**/*.tsx
```

## PWA功能

✅ 离线工作 - 缓存主要资源，即使没有网络也能访问已加载的单词
✅ 安装到主屏幕 - 像原生应用一样运行
✅ 快速加载 - 优化的资源和缓存策略
✅ 响应式设计 - 完美适配iPad和其他设备
✅ 数据持久化 - 使用浏览器存储保存学习进度

## 故障排除

### 页面加载缓慢

- 清除浏览器缓存（设置 → Safari → 清除历史记录和网站数据）
- 重新安装PWA应用
- 检查网络连接

### 无法连接到API

- 确保后端服务器在线
- 检查防火墙和代理设置
- 验证API地址配置正确

### 应用崩溃

- 检查浏览器控制台的错误信息
- 重新启动应用
- 更新到最新版本

## 更新应用

PWA应用会自动检查更新。当你部署新版本时，用户会在下次访问时收到更新提示。

如果想立即更新：
1. 完全关闭应用
2. 从设置中清除应用缓存
3. 重新打开应用

## 支持

如有问题，请检查：
1. 浏览器控制台的错误日志
2. Service Worker状态（在Safari开发者工具中）
3. 网络请求状态
