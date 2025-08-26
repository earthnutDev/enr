import { isBusinessEmptyString, isEmptyArray, isNull, isZero } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { bindImage } from '../buildBackground/utils/bind-image';
import { runSide } from '../buildBackground/run-side';

import { isNoneBackGroundColor, isNoneBackgroundImage } from '../tools';
import { setTransparentTexture } from '../buildBackground/default-background';
import { DrawImage } from '../rippersData/fadeData';
import { dog } from 'dog';

/**  两个图像间的淡入淡出  */
export function fade(this: Ripples) {
  const { renderData, fadeData, options } = this;
  const { toBeList } = fadeData;

  if (isNull(renderData)) {
    return Reflect.apply(exitFade, this, ['还没有准备好，即将退出']);
  }

  if (isEmptyArray(toBeList)) {
    return Reflect.apply(exitFade, this, ['由于缺少当前渲染的背景，退出']);
  }

  if (fadeData.drawProgress === 0) {
    dog('开始执行渐变，当前尚有可执行', toBeList.length);
    toBeList.forEach(e => dog(e));
  }
  // 进度完成则结束当前的进度
  if (fadeData.drawProgress > 1000) {
    // 最后使用的纹理
    fadeData.lastDrawImage = toBeList.shift()!;
    dog('执行渐变背景完毕，剩余可执行', toBeList);
    // 渲染到背景图
    // error 此处在原来使用了 laseDrawImage 忽略了
    Reflect.apply(bindImage, this, [fadeData.lastDrawImage]);
    // 尚有未执行完毕的
    if (isEmptyArray(toBeList)) {
      const { lastUseStyle } = renderData;
      // 没有设置背景色或是背景图
      if (
        (isNull(options.imgUrl) ||
          isBusinessEmptyString(options.imgUrl) ||
          isZero(options.imgUrl.length)) &&
        isNoneBackGroundColor(lastUseStyle.backgroundColor) &&
        isNoneBackgroundImage(lastUseStyle.backgroundImage)
      ) {
        // 因为此时渲染为空，需要手动添加一个默认渲染
        Reflect.apply(setTransparentTexture, this, [false]);
      }
    }
    // 启用下一轮的循环
    return Reflect.apply(exitFade, this, ['当前执行完毕，开启下次执行']);
  }
  const { lastDrawImage, backgroundInfo } = fadeData;

  fadeData.drawProgress += 18;
  // dog('当前的渲染进度', fadeData.drawProgress, fadeData.lastDrawImage);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  /**
   *  bug: 2508021258（2）
   *
   *  这里判定了当前的执行环境并退出了执行，但是并没有设定 `isTransitioning` 值
   *
   */
  if (isNull(ctx) || isNull(lastDrawImage.resource) || isEmptyArray(toBeList)) {
    dog('是我啦', isNull(ctx), '-', isNull(lastDrawImage.resource), '-', isEmptyArray(toBeList));
    return Reflect.apply(exitFade, this, '环境值错误');
  }
  const { width, height } = backgroundInfo;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  // ctx.globalCompositeOperation = 'destination-over';
  {
    // ctx.globalAlpha = 1 - drawProgress;
    ctx.drawImage(lastDrawImage.resource, 0, 0, width, height); // 绘制上一次的图案
    ctx.globalAlpha = fadeData.drawProgress / 1000; // 设置透明度
    /**
     * bug: 2508021258（1）
     *
     * TODO 这里 报错
     *
     * Cannot read properties of undefined (reading 'resource')
     *
     *
     * 报错说这里没有数据，在复现的 bug 数据中，数组第一位为 undefined，而 2、3 位有真实数据
     *
     * 确认该错误是由于在判定 `fadeData.isTransitioning` 为 `true` 造成的第一个待执行项不存在却被设置为新的数组的第一项
     *
     */
    ctx.drawImage(toBeList[0].resource, 0, 0, width, height);
  }

  ctx.globalAlpha = 1;
  /**  当前渲染项  */
  const currentDrawImage: DrawImage = {
    resource: canvas,
    width,
    height,
    kind: 'mix',
    tag: `${lastDrawImage.tag} >> ${toBeList[0].tag}`,
  };
  // 渲染渐变过程中的纹理
  Reflect.apply(bindImage, this, [currentDrawImage]);
  // 当前执行的列表中有两个（两个以上的可能性比较小）
  if (toBeList.length > 1) {
    fadeData.lastDrawImage = currentDrawImage;
    toBeList.shift();
    fadeData.drawProgress = 0;
  }
}

/**  退出当前的渐变执行  */
function exitFade(this: Ripples, message: string) {
  const { fadeData } = this;
  fadeData.isTransitioning = false;
  dog(message);
  Reflect.apply(runSide, this, []);
}
