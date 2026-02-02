'use client';
import { isNull } from 'a-type-of-js';

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { dog, dun } from 'zza/log';
import type { Ripples } from './class-ripple';
import type { RipplesOptions } from './types';

/**
 *  动态加载包含的自定义的钩子
 * @param canvas
 * @param option
 */
export function useLazyRipples(
  canvas: RefObject<HTMLCanvasElement | null>,
  option?: RipplesOptions,
): { ripples: RefObject<Ripples | null>; isLoading: boolean; error: unknown } {
  /**  react dom  */
  const ripples = useRef<Ripples>(null);
  /**  当前是否被卸载  */
  const isUnmounted = useRef(true);
  /**  是否已加载  */
  const isLoaded = useRef(false);
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  // 错误状态
  const [error, setError] = useState(null);

  /**  卸载  */
  function unmounted() {
    isUnmounted.current = true;
    if (dun) {
      dog('卸载');
    }
    setTimeout(() => {
      // 当前是被卸载状态
      if (isUnmounted.current) {
        if (dun) {
          dog('执行了卸载');
        }
        ripples.current?.destroy();
      }
    }, 0);
  }

  useEffect(() => {
    isUnmounted.current = false;
    /**  非空检验（这里一般都是有值的，除非故障）  */
    if (isNull(canvas.current) || isLoaded.current) {
      if (dun) {
        dog('不执行初始化，因为初始化已经在执行了 ', canvas.current, isLoaded.current);
      }
      return unmounted;
    }
    if (dun) {
      dog('执行了加载');
    }
    // 设置加载状态
    setIsLoading(true);
    isLoaded.current = true;
    import('./class-ripple')
      .then(module => {
        if (isNull(canvas.current) || isUnmounted.current) {
          if (dun) {
            dog('当前状态值不准确，执行失败');
          }
          return;
        }
        if (dun) {
          dog('加载了该项异步，并初始化了值');
        }
        ripples.current = new module.Ripples(canvas.current, option);
        return;
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return unmounted;
  }, []);

  return { ripples, isLoading, error };
}
