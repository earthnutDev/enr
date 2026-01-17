import { isArray, isNull, isString } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { getNewColor, getNewImage } from './get-new-image';
import { dog } from 'packages/enr/dog';

/**
 *  是否能执行渐变
 *
 * 返回值为 true 时禁止渐变
 *
 */
export function forbiddenRunSide(this: Ripples): boolean {
  const { fadeData, options, renderData } = this;
  // 没有渲染环境禁止渐变
  if (isNull(renderData)) return true;

  const { imgUrl } = options;

  const { lastUseStyle } = renderData;

  const { lastDrawImage, backgroundInfo } = fadeData;

  const { width, height } = backgroundInfo;

  const { tag, kind } = lastDrawImage;

  /**  当前的渲染地址  */
  const newImageSource: string | null = getNewImage(options, lastUseStyle);
  /**  宽相等  */
  const widthIsEqual = lastDrawImage.width === width;
  /**  高相等  */
  const heightIsEqual = lastDrawImage.height === height;
  /**  尺寸没有变换  */
  const sizeEqual = widthIsEqual && heightIsEqual;
  // 尺寸相同，资源相同，禁止变化
  if (kind === 'image' && sizeEqual && isString(newImageSource) && newImageSource === tag)
    return true;
  dog('通过图片校验');
  /**  新的获取的渐变资源  */
  const newGradientValue = (isArray(imgUrl) && imgUrl.join('_')) || '';
  // 渐变禁止执行变化
  if (kind === 'linear-gradient' && sizeEqual && newGradientValue === tag) return true;
  dog('通过渐变校验', newGradientValue, tag);
  /**  当前的背景色值  */
  const newBackgroundColor = getNewColor(options, lastUseStyle);
  //  当前渲染为色值，且色值发生了变化
  if (kind === 'background-color' && sizeEqual && tag === newBackgroundColor) return true;
  dog('通过背景色校验');

  return false;
}
