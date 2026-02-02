# enReact UI

## 一、安装

```sh
npm install  --save enr
# 或
npm install  --save earthnut
```

## 二、涟漪背景

- 尽管接受所有的 style 属性，但是 `position` 还是期待是非 'static' 值，否则将影响涟漪背景的渲染位置和显示状态；
- 当前如果设置了 `background` 的话，有可能在恢复时使得其覆盖其他子属性；
- 当前期待使用 `background-color` 设置背景色，而不是在上面的 `background` 中设置背景色。譬如：`background-color: #f0f6;`
- 当前更期待使用配置参数 `option` 的 'imgUrl' 来配置目标背景图（请注意图源的跨域问题）。譬如：`imgUrl: 'background.png'`
- 当然，也可以使用标准的 `background-image` 配置符合要求的背景图片（目前仅支持单张图配置）。譬如：`background-image: url(background.png);`
- 当前可配置 `background-image` 为渐变色，但仅支持从上到下的线性渐变（仅支持单渐变）。譬如： `background-image: linear-gradient(black, transparent);`
- 在同时配置了 `imgUrl`、`background-image`、`background-color` 时仅会显示一个效果（混合效果暂时并未实现）。优先展示 `imgUrl`，然后是 `background-image`，之后是 `background-color` 。如果都未设置则会展示默认的老式地板砖背景图
- 尽量不要是使用透明色或是当前的主背景色，否则导致涟漪的效果不明显

开发者提示：**切换背景最好不要通过设置**

## 三、自定义钩子

### 1. useTimeId

就是 `useRef` 和 `useEffect` 的简单使用。

```tsx
import { useTimeId } from 'enr';

export function Home() {
  const timeId = useTimeId();

  return (
    <>
      <button
        onclick={() => {
          timeId.current = setTimeout(
            () => console.log('没有感情的按钮 A 打印了一条没有感情的消息'),
            2500,
          );
        }}
      >
        没有感情的按钮 A
      </button>
      <button onclick={() => clearTimeout(timeId.current)}>没有感情的按钮 B</button>
    </>
  );
}
```

### 2. useAnimationFrame

使用下一帧动画。

```ts
import { useAnimationFrame } from 'enr';
```

## scss 样式

导出了一个 `common.css` 作为样式使用，还可以引用其中的 `scss` 文件使用其中的函数。如果使用 `common.css` 建议仅在跟下进行导入即可，避免多处引入导致包体积变大。

在使用 `webpack` 的应用中可以这样引入

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'node_modules/ui-library-a/src/scss')], // UI 库 SCSS 路径
              },
            },
          },
        ],
      },
    ],
  },
};
```

在使用 `vite` 的应用中可以这样引入

```js
// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${path.resolve(
          __dirname,
          'node_modules/ui-library-a/src/scss',
        )}" as lib;`,
        includePaths: [path.resolve(__dirname, 'node_modules/ui-library-a/src/scss')],
      },
    },
  },
});
```

为了防止意外覆盖别人的自定义 css 属性，该样式皆以 `en-` 为前缀。譬如：

```tsx
import { _en } from 'enr';

export function Home() {
  return (
    <div>
      <p className={_en('text-in-one-line')}>无论我字数多少，仅会会在同一行就行打印。</p>
    </div>
  );
}
```

使用样式应注意：

- `css`、`scss` 的直接导出仅是 `common.css`、`common.scss` 的别名
- `reset.css`、`reset.scss` 不建议在非项目中使用，因为使用 `*` 修改了所有元素为 `border-box` 且定位为 `relative`。旧项目引入该文件可能会覆盖所有的已配置好的盒样式
- 为了方便使用，包装了

## 文档

更多参阅 [enr](https://earthnut.dev/quickUse/)
