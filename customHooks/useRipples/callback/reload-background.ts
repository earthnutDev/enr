import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { loadImage } from '../buildBackground/load-image';
import { dog } from 'dog';
import { debounce } from 'a-js-tools';

const setCanvasSize = debounce((canvas, width, height) => {
  canvas.width = width;
  canvas.height = height;
  dog('触发真实的设置 canvas 尺寸');
}, 1000);

/**
 * 重新加载背景图片
 *
 *
 * 为了避免在高频父元素尺寸变化时触发 canvas 的 width、height 属性变化。
 * 使用防抖进行处理设置 canvas 的 width、height 值
 *
 */
export function reloadBackground(this: Ripples) {
  const { renderData, fadeData, canvas } = this;
  if (isNull(renderData)) return;
  const { parentElement } = renderData;
  const { backgroundInfo } = fadeData;
  const width = parentElement.offsetWidth,
    height = parentElement.offsetHeight,
    oldWidth = canvas.width,
    oldHeight = canvas.height;
  dog(
    '渲染尺寸',
    width,
    height,
    oldHeight,
    oldWidth,
    Math.abs(oldWidth - width),
    Math.abs(oldHeight - height),
  );
  if (width < 3 || height < 3) {
    dog('尺寸太小，直接忽略渲染');
    return;
  }
  // canvas.width =
  backgroundInfo.width = width;
  // canvas.height =
  backgroundInfo.height = height;

  setCanvasSize(canvas, width, height);

  dog('触发再次加载背景');
  Reflect.apply(loadImage, this, []);
}
