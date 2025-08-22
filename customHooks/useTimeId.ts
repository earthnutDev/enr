/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName earthnut
 * @FilePath /src/customHooks/useAnimationFrame.ts
 * @FileName useTimeId.ts
 * @CreateDate  周二  01/07/2025
 * @Description 使用定时器返回的时间戳
 ****************************************************************************/
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
