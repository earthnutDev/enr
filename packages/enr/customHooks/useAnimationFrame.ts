/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName earthnut
 * @FilePath /src/customHooks/useAnimationFrame.ts
 * @FileName useAnimationFrame.ts
 * @CreateDate  周二  01/07/2025
 * @Description 使用 animationFrame
 ****************************************************************************/
'use client';
import { isBoolean, isPlainObject } from 'a-type-of-js';
import { dog } from 'packages/enr/dog';

import { useCallback, useEffect, useRef } from 'react';

/**  使用动画结果  */
export interface UseAnimationFrameResult {
  /**  取消执行动画  */
  cancel(): void;
  /**  当前取消的状态  */
  canceled: boolean;
  /**  再次执行  */
  render(): void;
}

interface UseAnimationFrame {
  /**  当前动画的 id  */
  id: null | number;
  /**  执行的时间 */
  time: number;
  /**  暂停的时间  */
  cancelTime: number;
  /**  返回值  */
  result: UseAnimationFrameResult;
  immediately: boolean;
  /**  是否完成了额外的首次执行  */
  noun: boolean;
  /**  是否仅执行一次  */
  once: boolean;
  /**  是否首次执行 effect  */
  firstRunEffect: boolean;
  /**  是否已卸载  */
  isUnmounted: boolean;
}

export type AnimationFrameOption =
  | boolean
  | {
      immediately?: boolean;
      once?: boolean;
    };

/**
 *
 *  该钩子在组件卸载时会自动调用 `window.cancelAnimationFrame` 清理传入的回调方法。
 *  默认是传入即启动调用方法
 *
 * @description 创建一个会自己关闭（组建卸载时）的 animationFrame。当然，可以通过返回值手动终止
 * @param callback  使用回调函数。回调函数有两个参数，除了默认的时间，还有另一个用于暂停后的记时时间。如果没有主动暂停，两者时间总是趋近于相等的（可能有其他延迟造成时间差越来越大）。如果没有暂停需求，使用第一个默认时间就可以了。
 * @param [option=false] 使用第二参数，可指定是否立即执行及是否仅执行一次
 * @returns  返回值包含执行状态
 * @version 0.2.0
 * @see   https://earthnut.dev/custom-hooks/use-animation-frame
 * @example
 * 使用：
 *
 * ```ts
 *  // import { useAnimationFrame } from 'earthnut';
 *  ...
 *
 *  export function Home () {
 *  // 如果没有主动暂停的需要，直接使用默认的 time 最好。如果中间有使用暂停。那么 time 值是不连贯的，而 runTime 是连贯的
 *  const result = useAnimationFrame((time ,runTime) => {
 *     ... //
 *  });
 *
 *
 * return <>
 *
 *    <button onclick={() => result.cancel()}>暂停</button>
 *    <button onclick={() => result.render()}>恢复</button>
 *   </>
 * }
 *  ...
 *
 * ```
 *
 * 当然，可使用第二参数执行立即执行还是仅执行一次（作用不大，不与赘述）
 *
 */
export function useAnimationFrame(
  callback: (time: number, runtime: number) => void,
  option: AnimationFrameOption = false,
): UseAnimationFrameResult {
  if (isBoolean(option)) {
    option = {
      immediately: option,
      once: false,
    };
  } else if (isPlainObject(option)) {
    option = {
      once: isBoolean(option.once) ? option.once : false,
      immediately: isBoolean(option.immediately) ? option.immediately : false,
    };
  } else {
    option = {
      immediately: false,
      once: false,
    };
  }

  /**    */
  const animationFrame = useRef<UseAnimationFrame>({
    id: 0,
    immediately: option.immediately ?? true,
    once: option.once ?? false,
    noun: false,
    time: 0,
    cancelTime: 0,
    firstRunEffect: true,
    isUnmounted: true,
    result: {
      cancel() {
        dog.type = false;
        const { id } = animationFrame.current;
        dog('执行取消');
        if (id) window.cancelAnimationFrame(id);
        animationFrame.current.result.canceled = true;
        dog.type = true;
      },
      canceled: false,
      render() {
        const { current } = animationFrame;
        const { result } = current;
        current.cancelTime = performance.now();
        result.cancel();
        result.canceled = false;
        current.id = window.requestAnimationFrame(_);
      },
    },
  });
  const { current } = animationFrame;

  /**  转化为函数  */
  const _ = useCallback(
    (time: number) => {
      const { result } = current;
      const _time = time - current.cancelTime;
      current.time += _time < 0 ? 16.7 : _time;
      callback(time, current.time);
      // 如果不是仅执行一次，进入下一次执行
      if (!current.once) result.render();
    },
    [callback],
  );

  // 首次执行
  if (current.immediately && !current.noun && current.result.canceled) {
    dog('重复执行');

    current.noun = true;
    current.result.render();
  }

  useEffect(() => {
    dog.type = false;
    dog(
      '回调更替',
      '此时的是否为第一次执行状态为',
      current.firstRunEffect,
      '当前取消执行状态',
      current.result.canceled,
    );

    /// 非仅执行一次再次这里需要执行
    if (!current.once) {
      if (current.firstRunEffect) {
        current.result.render();
        current.firstRunEffect = false; //  标记为不允许执行
        dog.type = false;
        dog('第一次执行', '，执行后状态', current.result.canceled);
      } else if (!current.firstRunEffect && !current.result.canceled) {
        /**  非第一次执行  */
        current.result.render();
        dog.type = false;
        dog('非首次执行', '，执行后状态', current.result.canceled);
      }
    }
    dog.type = true;
  }, [callback]);

  /// 在组件退出时保证能正确的退出
  useEffect(() => {
    dog('执行');
    current.isUnmounted = false;
    return () => {
      current.isUnmounted = true;
      setTimeout(() => {
        dog('退出执行取消');
        if (current.isUnmounted) current.result.cancel();
      }, 0);
    };
  }, []);

  return current.result;
}
