/**  其实这并不是一个自定义钩子  */

import { EnTypeofClassNameItem, EnXcn, xcn } from 'xcn';

type EnClassName =
  | 'en-flex'
  | 'en-flex-row'
  | 'en-flex-row-reverse'
  | 'en-flex-column'
  | 'en-flex-column-reverse'
  | 'en-flex-wrap'
  | 'en-full-container'
  | 'en-center'
  | 'en-dust'
  | 'en-text-in-one-line'
  | 'en-text-in-one-line-hide'
  | 'en-text-in-two-line'
  | 'en-color-text'
  | 'en-bg-red'
  | 'en-float-left'
  | 'en-float'
  | 'en-float-right'
  | 'en-clear-float'
  | 'en-clear'
  | 'en-loading'
  | 'en-text-center'
  | 'en-text-right'
  | 'eb-text-small'
  | 'en-relative'
  | 'en-user-select-text'
  | 'en-cursor-pointer';

/**  在 xcn 中使用 earthnut 样式类 */
export function _en<T extends EnClassName[]>(
  ...classNameList: T
): EnXcn<{
  [K in keyof T]: EnTypeofClassNameItem<T[K]>;
}> {
  return xcn(...classNameList);
}
