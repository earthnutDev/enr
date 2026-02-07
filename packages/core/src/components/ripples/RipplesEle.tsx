/**
 * @module @enr/RipplesEle
 * @file RipplesEle.tsx
 * @description 涟漪
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-12-12 12:18
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-07 08:11
 */

'use client';

import { useRef } from 'react';
import { useRipples } from '../../customHooks/useRipples';
import { ComponentContent } from './Content';
import type { BackgroundRipplesProps } from './types';

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
 * @see https://lmssee.com/background-ripple
 * @example
 * 使用：
 *
 * ```ts
 *  import { BackgroundRipple } from 'enr/';
 *  // 也可以全量导入
 *  // import { BackgroundRipple } from 'enr';
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
  /**  canvas 元素  */
  const canvas = useRef<HTMLCanvasElement>(null);
  /**  使用 ripples  */
  const ripplesRef = useRipples(canvas, option);

  return <ComponentContent ripplesRef={ripplesRef} canvas={canvas} option={option} {...props} />;
};

BackgroundRipple.displayName = 'enr-background-ripple';

export { BackgroundRipple };
