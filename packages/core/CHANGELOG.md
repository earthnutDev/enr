# 版本日志

## 2.0.1 (2026-2-4)

- 修复打包构建中对 `react-dom` 的依赖版本的描述：`"react-dom": "19.1.0"` ➞ `"react-dom": "^19.1.0"`
- 调整了部分实现逻辑

## 2.0.0 (2026-2-3)

- 强依赖版本 `react` 由 17 提升到了 19.1
- 更新了依赖 `styled-components` 为正确的依赖版本号
- 原 `_en()` （`en()`） 可用参数发生了变化，不再兼容

## 2.0.0-alpha.4 (2026-2-1)

## 2.0.0-alpha.3 (2026-1-28)

### 被遗弃的 `forwardRef`

- 另一个问题就是 `react` 打算在 20 或 19 版本的后期移除 `forwardRef` （在 19 版本已经被标注为 _废弃_ ）。所以，为了全面迎接新的 react，将对本包进行重构

### `_en` 类名组织者

- 在使用其他包的时候，发现在公共部分导出 `_en` 是一件很 **愚蠢** 的事。但是如果将 `_en` 从主 index 导出移除又回导致新的问题。所以升级大版本，做不兼容式升级。 （在部分使用场景下，有时候仅需要使用 `_en` 函数，而该操作又会导致新的问题，那就是仅引入了一个 `_en` 函数，而导致编译器加载了几乎所有的代码） **这个居然是 package.json 文件未配置 `sideEffects: false`**
- 原 `_en` 方法以改写，可能参数支持有变，当前已不再兼容旧版本写法

### `ThemeColorModeProvider`

在 React 19 版本后，使用 `createContext` 构建的上下文，不在推荐使用 `SomeContext.Provider` 包裹组件，而是直接使用 `SomeContext`。

相应的 `ThemeColorModeProvider` 也做了更改。

### TODO

- react 不推荐使用 `isValidElement` ，但是（我）尚未找到替代方案，可能在下一个小版本迭代中修复这个问题
- react 不推荐使用 `cloneElement` ，但是（我）尚未找到替代方案，可能在下一个小版本迭代中修复这个问题
- react 不推荐使用 `Children` ，但是（我）尚未找到替代方案，可能在下一个小版本迭代中修复这个问题

## v1.1.1 (2025-12-16)

### 1. 🐛 修复 BUG

- 修复作为库的引入包时导致的在目标项目中无法使用的问题

### 2. ✨ 新增内容

- 为 `<Details>` 添加了 open 属性

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
