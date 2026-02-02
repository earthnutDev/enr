import { isNumber } from 'a-type-of-js';
import { Fragment, isValidElement, type ReactNode } from 'react';

/**
 * 获取数值
 * @param value
 */
export function getValue(value: number | string) {
  if (isNumber(value) || parseInt(value) === Number(value)) return value + 'px';
  return value || 0;
}

/**
 *  判断是否为 Fragment 元素
 * @param element
 */
export function isFragment(element: ReactNode) {
  // TODO ： `isValueElement` 将可能在未来的版本中被移除
  return isValidElement(element) && element.type === Fragment;
}
