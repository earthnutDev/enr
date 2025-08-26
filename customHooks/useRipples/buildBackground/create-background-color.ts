import { isArray, isEmptyArray, isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { setTransparentTexture } from './default-background';
import { isNoneBackGroundColor } from '../tools';

import { DrawImage } from '../rippersData/fadeData';
import { getNewColor } from '../callback/get-new-image';
import { dog } from 'dog';

/**  构建背景色  */
export function createBackgroundColor(this: Ripples) {
  const { renderData, fadeData, options } = this;

  if (isNull(renderData)) {
    dog('当前尚未获取到渲染数据');
    // 没有值时设置为默认的类透明背景色
    return Reflect.apply(setTransparentTexture, this, []);
  }
  const { originStyle } = renderData;
  // 验证不完全
  if (
    isNoneBackGroundColor(originStyle.backgroundColor) &&
    (!isArray(options.imgUrl) || options.imgUrl.length !== 1)
  ) {
    dog('当前没有配置背景色');
    return Reflect.apply(setTransparentTexture, this, []);
  }
  /**  画布  */
  const canvas = document.createElement('canvas');
  /**  执行上下文  */
  const ctx = canvas.getContext('2d');
  if (isNull(ctx)) {
    dog('当前未获取到画布的执行上下文');
    return Reflect.apply(setTransparentTexture, this, []);
  }

  const { width, height } = fadeData.backgroundInfo;
  canvas.width = width;
  canvas.height = height;
  // 清理画布
  ctx.clearRect(0, 0, width, height);
  const drawColor = getNewColor(options, originStyle);
  ctx.beginPath();
  ctx.fillStyle = drawColor;
  ctx.fillRect(0, 0, width, height);
  ctx.fill();
  if (fadeData.isTransitioning && !isEmptyArray(fadeData.toBeList)) {
    /// 当前处于渐变过程，仅保留第一个
    fadeData.toBeList = [fadeData.toBeList[0]];
  } else {
    /// 当前不在渐变状态，直接清空渲染层
    fadeData.toBeList = [];
  }

  const nestDrawImage: DrawImage = {
    resource: canvas,
    kind: 'background-color',
    tag: drawColor,
    width,
    height,
  };
  /// 在上面更改了 toBeList 的指向，这里必须使用全新的 fadeData.toBeList
  fadeData.toBeList.push(nestDrawImage);
  dog('添加了背景色', drawColor, nestDrawImage);
  fadeData.run(); // 执行渐变
  dog('目前有', fadeData.toBeList);
}
