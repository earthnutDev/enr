/**
 * @module @enr/tools
 * @file tools.ts
 * @description 工具
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-12-07 01:36
 * @version 2.0.0-alpha.0
 * @lastModified 2026-01-25 01:37
 */

import { isNull, isUndefined } from 'a-type-of-js';

/**
 *  背景色值为空
 * @param color
 */
export function isNoneBackGroundColor(color: string): boolean {
  return color === 'rgba(0, 0, 0, 0)' || color === '#ffffffff' || color === 'transport';
}

/**
 *  背景图为空
 * @param src
 */
export function isNoneBackgroundImage(src: string): boolean {
  return src === 'none' || src === '';
}

/**
 *  根据给出的 src 获取一个 img 对象
 * @param src
 * @param width
 * @param height
 */
export function createImageBySrc(src: string, width: number, height: number) {
  const img = new Image(width, height);
  img.width = width;
  img.height = height;
  img.src = src;
  return img;
}

/**
 * 检测数据是否为 url 外联图像地址
 * @param value
 */
export function extractUrl(value?: string) {
  if (isUndefined(value)) return null;
  const urlMatch = /url\(["']?([^"']*)["']?\)/.exec(value);
  return isNull(urlMatch) ? null : urlMatch[1];
}

/**
 * ## 给定的字符串是否为百分数
 * @param value
 */
export function isPercentage(value: string) {
  return value.endsWith('%');
}

/**
 *
 * 转换背景的位置为特定的格式
 *
 * @param value
 */
export function translateBackgroundPosition(value: string): string[] {
  if (/\s+/.test(value)) {
    return value
      .replace(/center/, '50%')
      .replace(/top|left/, '0%')
      .replace(/bottom/, '100%')
      .replace(/\s+/, ' ')
      .split(' ');
  } else if (isPercentage(value)) {
    return [value, '50%'];
  } else {
    return {
      center: ['50%', '50%'],
      top: ['50%', '0%'],
      bottom: ['50%', '100%'],
      left: ['0%', '50%'],
      right: ['100%', '50%'],
    }[value as 'center' | 'top' | 'bottom' | 'left' | 'right'];
  }
}
