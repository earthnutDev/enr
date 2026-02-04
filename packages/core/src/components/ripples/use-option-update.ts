import { isArray } from 'a-type-of-js';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { dog, dun } from 'zza/log';
import { defaultDataKey } from '../../customHooks/useRipples/data-default';
import type { Ripples, RipplesOptions } from '../../customHooks/useRipples/index';

/**
 * 更新参数数据
 * @param ripplesRef
 * @param option
 */
export function useOptionUpdate(
  ripplesRef: RefObject<Ripples | null>,
  option: RipplesOptions | undefined,
) {
  if (dun) {
    dog('执行打印', option);
  }

  const oldOption = useRef({ ...option });
  /**  监听数据变化并给值  */
  useEffect(() => {
    if (dun) {
      dog.type = false;
    }
    if (!option || !ripplesRef.current) {
      if (dun) {
        dog.type = true;
      }
      return;
    }
    defaultDataKey.forEach(e => {
      /**  新的值  */
      const value = option[e] as never;
      /**  测试值是否相等  */
      const checkArr = ((v: unknown, ov: unknown) =>
        (isArray(v) && isArray(ov) && (v.length !== ov.length || v.some((k, i) => k !== ov[i]))) ||
        ((!isArray(v) || !isArray(ov)) && v !== ov))(value, oldOption.current[e]);

      if (dun) {
        dog('我在这里', value, oldOption.current[e]);
      }

      if (ripplesRef.current && checkArr) {
        if (dun) {
          dog('设置值', e, value);
        }
        // 使用转化后的值
        oldOption.current[e] = isArray(value) ? ([...value] as never) : (option[e] as never);
        ripplesRef.current.set(e, value);
      }
    });
    if (dun) {
      dog.type = true;
    }
  }, [option]);
}
