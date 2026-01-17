import { isArray, isString } from 'a-type-of-js';
import { extractUrl } from './extract-url';
import { OriginStyle } from '../buildBackground/type';
import { UseOptions } from '../rippersData/useOptions';

/**  获取当前的背景图的地址  */
export function getNewImage(options: UseOptions, lastStyle: OriginStyle): string | null {
  const { imgUrl } = options;
  return (isString(imgUrl) && imgUrl) || extractUrl(lastStyle.backgroundImage);
}

/**  获取新的背景图  */
export function getNewColor(options: UseOptions, originStyle: OriginStyle) {
  return (
    (isArray(options.imgUrl) && options.imgUrl.length === 1 && options.imgUrl[0]) ||
    originStyle.backgroundColor
  );
}

/**  获取新的渐变  */
export function getNewGradient() {}
