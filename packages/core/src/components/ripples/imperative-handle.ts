/**
 * @module @enr/imperative-handle
 * @file imperative-handle.ts
 * @description 公共的命令句柄
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-02-04 06:52
 * @version 2.0.1
 * @lastModified 2026-03-25 20:31
 */

import { isUndefined } from 'a-type-of-js';
import type { RefObject } from 'react';
import type { Ripples } from '../../customHooks/useRipples/class-ripple';
import { defaultData } from '../../customHooks/useRipples/data-default';
import type { RipplesOptions } from '../../customHooks/useRipples/types';
import type { RippleEle } from './types';

/**
 * ## 通过函数构建公共的命令句柄
 * @param ripplesRef
 */
export function createImperativeHandle(ripplesRef: RefObject<Ripples | null>): () => RippleEle {
  return () => ({
    toggleState: () => ripplesRef.current?.changePlayingState() ?? false,
    get state(): boolean {
      return ripplesRef.current?.get('playingState') ?? false;
    },
    pause(): void {
      ripplesRef.current?.pause();
    },
    play(): void {
      ripplesRef.current?.play();
    },
    set(options?: RipplesOptions): void {
      if (isUndefined(options)) return;
      const keys = Object.keys(options) as (keyof RipplesOptions)[];
      for (let i = 0, j = keys.length; i < j; i++) {
        const key = keys[i];
        ripplesRef.current?.set(key, options[key] as unknown);
      }
    },
    drop(x: number, y: number, options?: { radius?: number; strength?: number }): void {
      ripplesRef.current?.drop(
        x,
        y,
        options?.radius ?? ripplesRef?.current.get('dropRadius') ?? defaultData.dropRadius,
        options?.strength ?? ripplesRef?.current?.get('perturbation') ?? 0.03,
      );
    },
  });
}
