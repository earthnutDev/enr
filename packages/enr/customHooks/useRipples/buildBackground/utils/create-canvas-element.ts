import { isNull } from 'a-type-of-js';
import { Ripples } from '../../../../components/ripples';

/**  根据给出的 html 数据构建一个 canvas   */
export function createCanvasElement(this: Ripples, img: CanvasImageSource) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { fadeData } = this;
  if (isNull(ctx)) return canvas;
  const { width, height } = fadeData.backgroundInfo;
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return canvas;
}
