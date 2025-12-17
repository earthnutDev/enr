import { isNull } from 'a-type-of-js';
import { createDefault } from './createDefault';
import { dog } from 'packages/enr/dog';

/**  通过尺寸创建一个默认图  */
export function createCanvasElementBySize(width: number, height: number) {
  dog('本次构建的宽度为', width, '高度为', height);
  /**  构建空的 canvas  */
  const canvas = document.createElement('canvas');
  const canvasR = document.createElement('canvas');
  /**  执行上下文  */
  const ctx = canvas.getContext('2d');
  const ctxR = canvasR.getContext('2d');
  if (isNull(ctx) || isNull(ctxR)) return canvas;
  canvas.width = canvasR.width = width || 1;
  canvas.height = canvasR.height = height || 1;
  ctx.clearRect(0, 0, width, height); // 清理画布
  ctxR.clearRect(0, 0, width, height);
  ctx.globalAlpha = 1;
  ctx.putImageData(createDefault(width, height), 0, 0);
  ctxR.fillStyle = '#ffffff';
  ctxR.fillRect(0, 0, width, height);
  // ctxR.globalCompositeOperation = 'copy';
  ctxR.drawImage(canvas, 0, 0, width || 1, height || 1);
  ctxR.globalCompositeOperation = 'source-over';
  return canvasR;
}
