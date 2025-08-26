import { isEmptyArray, isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { createImageBySrc } from './utils/create-image-by-src';
import { createLinearGradient } from './create-linear-gradient';
import { getNewImage } from '../callback/get-new-image';
import { dog } from 'dog';
/**
 *
 * 加载图像
 *
 * - 初始化的时候首先触发加载背景图像
 * - 通过 Ripple 的 set 方法设置属性 imgUrl 值时将触发
 * - 尺寸发生变化时亦将触发更改
 * - 父元素的样式属性发生变更时也会触发
 *
 * 在加载过程中如果渲染的图片为非法的（加载错误）那么将查找当前的背景色或是背景图作为依据，再就是都没有的情况下将会渲染一个类似于旧地板的色
 */
export function loadImage(this: Ripples) {
  dog('开始下载图片');
  const { renderData, options, fadeData } = this;
  if (isNull(renderData)) {
    dog('执行绘制时没有渲染数据');
    Reflect.apply(createLinearGradient, this, []);
    return;
  }
  const { lastUseStyle } = renderData;
  const { backgroundInfo } = fadeData;

  const { width, height } = backgroundInfo;
  const newImageSource: string | null = getNewImage(options, lastUseStyle);
  dog('当前获取的图像资源为', newImageSource);
  // 倘若图片资源未更改，则无需从新下载（但需要有值前提下）
  // 图片资源未更改，但是尺寸发生变化时亦会触发该方法
  // if (newImageSource === renderData.imageSource && newImageSource) return;
  renderData.imageSource = newImageSource!;
  // 虚假来源意味着没有背景。
  if (!newImageSource) {
    dog('没有原始图像，开始使用空白自绘');
    Reflect.apply(createLinearGradient, this, []);
    return;
  }
  // 从新图像加载纹理。
  const image = createImageBySrc(newImageSource, width, height);
  image.onload = () => {
    clearTimeout(fadeData.transparentId); // 清理默认的渲染透明
    dog('当前下载背景图', newImageSource);
    dog('背景图下载完毕', fadeData.toBeList.length);
    dog('当前是否在渐变', fadeData.isTransitioning);
    //  当前是否在渲染
    if (fadeData.isTransitioning && !isEmptyArray(fadeData.toBeList)) {
      // 下载有效背景时清理默认的背景纹理和同地址的背景纹理
      fadeData.toBeList = [
        fadeData.toBeList[0],
        ...fadeData.toBeList
          .slice(1)
          .filter(
            e =>
              e.kind === 'image' &&
              (Math.abs(e.width - width) > 2 ||
                Math.abs(e.height - height) > 2 ||
                e.tag !== newImageSource),
          ),
      ];
    } else {
      /// 当前并不在渐变直接清空带渲染层
      fadeData.toBeList = [];
    }
    fadeData.toBeList.push({
      resource: image,
      width,
      height,
      kind: 'image',
      tag: newImageSource,
    }); // 设置渐变过去
    dog('添加后的列表长度', fadeData.toBeList);
    fadeData.run(); // 开启渐变
  };

  // 下载图像出错
  image.onerror = () => {
    dog('下载图像错误');
    Reflect.apply(createLinearGradient, this, []);
  };

  // 当图像源是数据 URI 时禁用 CORS。
  // TODO
  image.crossOrigin = options.crossOrigin;
}
