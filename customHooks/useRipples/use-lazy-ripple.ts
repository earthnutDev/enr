import { useEffect, useRef, useState } from 'react';
import { Ripples } from './ripplesClass';
import { RipplesOptions } from './types';
import { isNull } from 'a-type-of-js';
import { dog } from 'dog';
/**  动态加载包含的自定义的钩子  */
export function useLazyRipples(
  canvas: React.RefObject<HTMLCanvasElement | null>,
  option?: RipplesOptions,
): { ripples: React.RefObject<Ripples | null>; isLoading: boolean; error: unknown } {
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
    dog.warn('卸载');
    setTimeout(() => {
      // 当前是被卸载状态
      if (isUnmounted.current) {
        dog.error('执行了卸载');
        ripples.current?.destroy();
      }
    }, 0);
  }

  useEffect(() => {
    isUnmounted.current = false;
    /**  非空检验（这里一般都是有值的，除非故障）  */
    if (isNull(canvas.current) || isLoaded.current) {
      dog.type = true;
      dog.warn('不执行初始化，因为初始化已经在执行了 ', canvas.current, isLoaded.current);
      return unmounted;
    }
    dog.warn('执行了加载');
    // 设置加载状态
    setIsLoading(true);
    isLoaded.current = true;
    import('./ripplesClass')
      .then(module => {
        if (isNull(canvas.current) || isUnmounted.current) {
          dog('当前状态值不准确，执行');
          return;
        }
        dog.error('加载了该项异步，并初始化了值');
        ripples.current = new module.Ripples(canvas.current, option);
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
