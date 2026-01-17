import { isNumber } from 'a-type-of-js';

/**
 * 获取数值
 */
export function getValue(value: number | string) {
  if (isNumber(value) || parseInt(value) === Number(value)) return value + 'px';
  return value || 0;
}
