import { Fragment, isValidElement, ReactNode } from 'react';

/**  判断是否为 Fragment 元素  */
export function isFragment(element: ReactNode) {
  return isValidElement(element) && element.type === Fragment;
}
