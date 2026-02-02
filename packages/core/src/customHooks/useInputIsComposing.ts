/**
 * @module @enr/useInputIsComposing
 * @file useInputIsComposing.ts
 * @description 使用输入框是否完成输入状态
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2025-01-07 11:23
 * @version 2.0.0-alpha.0
 * @lastModified 2026-01-24 11:23
 */

'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 *
 * ### 导出一个使用 `useRef` 创建的 `boolean`
 *
 *  *由于是包裹在 RefObject 之中，判断时务必使用 `isComposing.current` 进行判断*
 * @description 用于判断当前的输入状态是否结束
 * @param inputRef [RefObject<HTMLInputElement | HTMLTextAreaElement>] 输入框的 ref
 * @returns  RefObject<boolean>
 * @version 0.0.4
 * @see   https://earthnut.dev/custom-hooks/use-input-is-composing
 * @example
 *
 * 使用：
 *
 * ```ts
 *  import { useInputIsComposing } from 'earthnut';
 *
 *  ...
 *  const inputRef = useRef<HTMLInputElement>(null);
 *
 *  const inputIsComposing = useInputIsComposing(inputRef);
 *  ...
 *  function enterDown(e: React.KeyboardEvent<HTMLInputElement>) {
 *     if (e.key === 'Enter') {
 *        if (isComposing.current) {
 *            console.log("此时此景，按回车键说明为了从候选词中挑选");
 *        } else {
 *           console.log("输入完毕，敲回车是为了看一些开发者是否绑定了其他事件");
 *        }
 *     }
 *  }
 *  ...
 *  <input type="text" onKeyDown={enterDown} ref={inputRef} />
 *  ...
 * ```
 */
export function useInputIsComposing(
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
): RefObject<boolean> {
  /** 当前输入框是否输入模式结束 */
  const isComposing = useRef<boolean>(false);

  /** 监视当前编辑器输入状态 */
  useEffect(() => {
    const _i = inputRef.current; /// 当前元素
    if (!_i) return; /// 没有（不可能事件但是）获取元素直接返回
    const handleCompositionStart = () => (isComposing.current = true); /// 键盘输入
    const handleCompositionEnd = () => (isComposing.current = false); /// 键盘输入结束
    // _i.focus(); /// 让该元素显示时自动聚焦
    _i.addEventListener('compositionstart', handleCompositionStart); /// 监听键盘输入事件
    _i.addEventListener('compositionend', handleCompositionEnd); /// 监听键盘输入结束事件
    return () => {
      _i.removeEventListener('compositionstart', handleCompositionStart); /// 取消监听键盘输入事件
      _i.removeEventListener('compositionend', handleCompositionEnd); /// 取消监听键盘输入结束事件
    };
  }, []);

  return isComposing;
}
