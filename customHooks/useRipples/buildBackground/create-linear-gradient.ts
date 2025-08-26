import { isArray, isEmptyArray, isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';

import { createBackgroundColor } from './create-background-color';
import { dog } from 'dog';

/**  构建渐变背景色图  */
export function createLinearGradient(this: Ripples) {
  const { fadeData, renderData, options } = this;

  if (isNull(renderData)) {
    dog('暂未获取到执行上下文');
    return Reflect.apply(createBackgroundColor, this, []);
  }

  const { originStyle } = renderData;

  if (!/linear-gradient\(.*\)/.test(originStyle.backgroundImage) && !isArray(options.imgUrl)) {
    dog('当前不符合渐变配置');
    return Reflect.apply(createBackgroundColor, this, []);
  }
  const colorList =
    (isArray(options.imgUrl) && options.imgUrl.length > 1 && options.imgUrl) ||
    originStyle.backgroundImage
      .replace(/^.*linear-gradient\((.*)\).*$/, '$1')
      .split('),')
      .map(e => {
        e = e.trim();
        if (!e.endsWith(')')) e += ')';
        return e;
      })
      .filter(e => e.startsWith('rgb') || e.startsWith('#'));

  if (colorList.length < 2) {
    dog('当前获取的渐变色值数量少于 2');
    return Reflect.apply(createBackgroundColor, this, []);
  }
  /**  构建画布  */
  const canvas = document.createElement('canvas');
  /**  构建执行上下文  */
  const ctx = canvas.getContext('2d');

  if (isNull(ctx)) {
    dog('未获取执行上下文');
    return Reflect.apply(createBackgroundColor, this, []);
  }
  const { backgroundInfo } = fadeData;
  const { width, height } = backgroundInfo;
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  /**  渐变画笔  */
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  colorList.forEach((e, i) => gradient.addColorStop(i / (colorList.length - 1), e));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  if (fadeData.isTransitioning && !isEmptyArray(fadeData.toBeList)) {
    /// 当前处于渐变过程，仅保留第一个
    fadeData.toBeList = [fadeData.toBeList[0]];
  } else {
    /// 当前不在渐变状态，直接清空渲染层
    fadeData.toBeList = [];
  }

  fadeData.toBeList.push({
    resource: canvas,
    kind: 'linear-gradient',
    tag: colorList.join('_'),
    width,
    height,
  });
  dog('添加了渐变背景', colorList);
  fadeData.run();
}
