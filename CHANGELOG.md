# 版本日志

## v1.1.0 (2025-12-4)

### ✨ 新增内容

- 添加 `<Details>` ，嗯，自觉比原版好看一丢丢

## v1.0.3 (2025-11-15)

## v1.0.2 (2025-10-23)

### 🚀 性能优化

- 移除了 `Ripples` 中不必要的节流，该节流使用了 `LazyBackgroundRipple`、`useLazyRipples`、`useRipples`、`BackgroundRipple` 的父元素在尺寸变化时延迟渲染带来了不好的用户体验

莫名其面的在拉伸页面时，`LazyBackgroundRipple` 及 `BackgroundRipple` 居然不闪了。原来是 `canvas.width` 和 `canvas.height` 是控制 **Canvas 的绘制缓存区的大小**（即像素分辨率），修改它会

- 重新分配 GPU 内存
- **清空画布内容**
- 重制 WebGL 上下文的 `viewport`

### 🐛 修复 BUG

- 修复了 `Ripples` 的父元素在移除时，仍在渲染背景而导致的报错

### 🎨 界面优化

- 将原有的 `LazyBackgroundRipple` 和 `BackgroundRipple` 默认背景下一个偏移 4 像素更改为 1 像素的偏移，让视觉不那么明显

## v1.0.1 (2025-8-31)

将 `_en` 使用别名 `en`、 `enc` 导出

## v1.0.0 (2025-8-30)

变个正式版本号
