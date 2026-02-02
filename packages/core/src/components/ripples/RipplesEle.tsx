/**
 * @module @enr/RipplesEle
 * @file RipplesEle.tsx
 * @description 涟漪
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-12-12 12:18
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-02 17:07
 */

'use client';

import { isUndefined } from 'a-type-of-js';
import { useImperativeHandle, useRef } from 'react';
import { useRipples } from '../../customHooks/useRipples';
import type { RipplesOptions } from '../../customHooks/useRipples/types';
import { Content } from './Content';
import type { BackgroundRipplesProps } from './types';
import { useOptionUpdate } from './useOptionUpdate';

/**
 *
 * ### 一个 ripple 背景组件
 *
 *
 * *需要为该组件或父组件设置背景，否则即便的渲染了，效果不明显*
 *
 *  参数 props 属性：
 * - option   初始化 ripples 的原始数据
 * @param props  使用参数
 * @param props.option 初始化 ripple 的原始数据
 * @version 0.0.1
 * @see https://earthnut.dev/earthnut/background-ripple
 * @example
 * 使用：
 *
 * ```ts
 *  import { BackgroundRipple } from 'earthnut';
 *  // 也可以全量导入
 *  // import { BackgroundRipple } from 'earthnut';
 *  ...
 *  const animationFrameId = useAnimationFrame();
 *
 *  return <BackgroundRipple>
 *            ...
 *         </BackgroundRipple>
 * ```
 *
 */
const BackgroundRipple = ({ option, ...props }: BackgroundRipplesProps) => {
  const { children, style, ref, ..._props } = props;
  /**  canvas 元素  */
  const canvas = useRef<HTMLCanvasElement>(null);
  /**  使用 ripples  */
  const ripplesRef = useRipples(canvas, option);

  ///  使用 配置更新
  useOptionUpdate(ripplesRef, option);

  // 抛出事件 (自定义抛出事件)
  useImperativeHandle(ref, () => ({
    toggleState: () => ripplesRef.current?.changePlayingState() ?? false,
    get state(): boolean {
      return ripplesRef.current?.options.playingState ?? false;
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
  }));

  return (
    <Content
      style={{
        backgroundRepeat: 'round',
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        ...style,
      }}
      {..._props}
    >
      <canvas ref={canvas} data-earthnut-ui="canvas" width={0} height={0} />
      {children}
    </Content>
  );
};

BackgroundRipple.displayName = 'enr-background-ripple';

export { BackgroundRipple };
