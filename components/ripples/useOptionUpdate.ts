import { isArray } from 'a-type-of-js';
import { Ripples, RipplesOptions } from '../../customHooks/useRipples/index';
import { RefObject, useEffect, useRef } from 'react';
import { dog } from 'dog';

/**
 * 更新参数数据
 */
export function useOptionUpdate(
  ripplesRef: RefObject<Ripples | null>,
  option: RipplesOptions | undefined,
) {
  dog('执行打印', option);

  const oldOption = useRef({ ...option });
  /**  监听数据变化并给值  */
  useEffect(() => {
    if (!option || !ripplesRef.current) return;
    (Object.keys(ripplesRef.current.defaults) as unknown as (keyof RipplesOptions)[]).forEach(e => {
      /**  新的值  */
      const value = option[e] as never;
      /**  测试值是否相等  */
      const checkArr = ((v: unknown, ov: unknown) =>
        (isArray(v) && isArray(ov) && (v.length !== ov.length || v.some((k, i) => k !== ov[i]))) ||
        ((!isArray(v) || !isArray(ov)) && v !== ov))(value, oldOption.current[e]);

      dog('我在这里', value, oldOption.current[e]);

      if (ripplesRef.current && checkArr) {
        dog('设置值', e, value);
        // 使用转化后的值
        oldOption.current[e] = isArray(value) ? ([...value] as never) : (option[e] as never);
        ripplesRef.current.set(e, value);
      }
    });
  }, [option]);
}
