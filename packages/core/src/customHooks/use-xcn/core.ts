/**
 * @packageDocumentation
 * @module @enr/core
 * @file core.ts
 * @description _
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-28 13:03
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-02 11:38
 */

import { xcn, type EnTypeofClassNameItem, type EnXcn } from 'xcn';
import { dog, dun } from 'zza/log';
import { GLOBAL_CSS } from './css';
import type { EnClassName } from './types';

/**
 *  在 xcn 中使用 enr 样式类
 * @param classNameList
 */
export function _en<T extends EnClassName[]>(
  ...classNameList: T
): EnXcn<{
  [K in keyof T]: EnTypeofClassNameItem<T[K]>;
}> {
  return xcn(...(classNameList.map(e => 'en-'.concat(e)) as T));
}

/**
 * ## 测验当前是否已存在
 */
export function ensureGlobalStyles(): boolean | undefined {
  if (!globalThis?.document?.styleSheets) return;
  const elementTagName = 'style';
  const dataUiLib = 'data-ui-lib';
  const name = 'enr';
  const checkRuleText = '.enr-color-text';
  // 基本校验
  if (globalThis?.document?.querySelector(`${elementTagName}[${dataUiLib}="${name}"]`)) return;
  /// 强校验，防止使用 其他方法将 css 注入到其它样式表中
  const hasStyles = Array.from(document.styleSheets).some(sheet => {
    try {
      return Array.from(sheet.cssRules).some(rule => rule.cssText?.includes(checkRuleText));
    } catch (_e) {
      return false;
    }
  });

  if (hasStyles) return;

  const style = document.createElement(elementTagName);
  style.setAttribute(dataUiLib, name);
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
  if (dun) {
    dog('样式表插入成功 🏅');
  }
}
