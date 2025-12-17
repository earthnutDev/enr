import { isNull } from 'a-type-of-js';

/** 检测数据是否为 url 外联图像地址 */
export function extractUrl(value: string) {
  const urlMatch = /url\(["']?([^"']*)["']?\)/.exec(value);
  return isNull(urlMatch) ? null : urlMatch[1];
}
