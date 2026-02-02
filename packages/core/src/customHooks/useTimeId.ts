/**
 * @module @enr/useTimeId
 * @file useTimeId.ts
 * @description 使用定时器返回的时间戳
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2025-01-07 11:20
 * @version 2.0.0-alpha.0
 * @lastModified 2026-01-24 11:21
 */

'use client';

import { useEffect, useRef } from 'react';
/**
 *
 * ### 导出一个使用 `useRef` 创建的 `NodeJS.Timeout`
 *
 * 该数值在组件卸载时会自动调用 `clearTimeout` 清理
 *
 * @version 0.0.3
 * @see   https://earthnut.dev/custom-hooks/use-time-id
 * @example
 *
 * 使用：
 *
 * ```ts
 *  // import { useTimeId } from 'earthnut';
 *  ...
 *  const timeoutId = useTimeId();
 *
 *  useEffect(()=>{
 *      timeoutId.current = setTimeout(()=>{
 *          ...
 *      } ,delay);
 *  });
 *  ...
 *
 * ```
 *
 * 其实，正确的用法是这样的：
 *
 * ```ts
 *
 *  useEffect(()=>{
 *    const timeId = setTimeout(()=>{
 *        ...
 *    }, delay) ;
 *
 *     return ()=> timeId && clearTimeout(timeId);
 *  });
 *
 * ```
 *
 * 根本就不用引入这个自定义 `hook` , 哈哈哈哈哈
 *
 */
export function useTimeId() {
  const timeId = useRef<NodeJS.Timeout>(undefined);
  useEffect(() => () => timeId.current && clearTimeout(timeId.current), []);
  return timeId;
}
