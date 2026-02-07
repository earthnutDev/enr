/**
 * @module @enr/LazyRippleEle
 * @file LazyRippleEle.tsx
 * @description 涟漪
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-12-12 12:11
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-07 08:11
 */

'use client';

import { useRef } from 'react';
import { useLazyRipples } from '../../customHooks/useRipples/use-lazy-ripple';
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
 * - children 内嵌的 ReactNode
 * - style    更改显示的样式
 * - option   初始化 ripples 的原始数据
 * @param props  使用参数
 * @param props.option 初始化状态设定选项
 * @version 0.0.1
 * @see https://lmssee.com/lazy-background-ripple
 * @example
 * 使用：
 *
 * ```ts
 *  import { LazyBackgroundRipple } from 'enr/LazyBackgroundRipple';
 *  // 也可以全量导入
 *  // import { LazyBackgroundRipple } from 'enr';
 *  ...
 *  const animationFrameId = useAnimationFrame();
 *
 *  return <LazyBackgroundRipple>
 *            ...
 *         </LazyBackgroundRipple>
 * ```
 *
 */
const LazyBackgroundRipple = ({ option, ...props }: BackgroundRipplesProps) => {
  /**  canvas 元素  */
  const canvas = useRef<HTMLCanvasElement>(null);
  /**  使用 ripples  */
  const { ripples } = useLazyRipples(canvas, option);

  return <ComponentContent ripplesRef={ripples} canvas={canvas} option={option} {...props} />;
};

LazyBackgroundRipple.displayName = 'enr-lazy-background-ripple';

export { LazyBackgroundRipple };
