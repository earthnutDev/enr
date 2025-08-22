/****************************************************************************
 *  @Author earthnut
 *  @Email earthnut.dev@outlook.com
 *  @ProjectName earthnut
 *  @FileName index.ts
 *  @CreateDate  周五  06/20/2025
 *  @Description 使用 ripple 的主要核心逻辑
 ****************************************************************************/
'use client';
import { useEffect, useRef } from 'react';
import { BackgroundRipplesProps, RippleImgUrl, RipplesOptions } from './types';
import { Ripples } from './ripplesClass';
import { isNull } from 'a-type-of-js';

/**
 *
 * ## 使用绘制 ripples 上一层
 *
 *
 * @param canvas `usrRef` 包裹的 `HTMLCanvasElement`，用于绘制图像
 * @param option  初始化的
 * @version 0.0.3
 * @see  https://earthnut.dev/custom-hooks/use-ripples
 * @see  JQuery https://github.com/sirxemic/jquery.ripples
 * @example
 *
 * 下面是在 <BackgroundRipple> 中使用
 *
 * ```ts
 * import { useRipples } from 'earthnut';
 *
 *  export function BackgroundRipple(props: BackgroundRipplesProps) {
 *
 *   // canvas 元素
 *  const canvas = useRef<HTMLCanvasElement>(null);
 *
 *  // 使用 ripples
 *  const ripplesRef = useRipples(canvas, props);
 *
 *  return (<>
 *     <canvas ref={canvas}></canvas>
 *     {props.children}
 *  </>);
 *  }
 *
 * ```
 *
 */
export function useRipples(
  canvas: React.RefObject<HTMLCanvasElement | null>,
  option?: RipplesOptions,
): React.RefObject<Ripples | null> {
  /**  react dom  */
  const ripples = useRef<Ripples>(null);

  // 初始化数据
  useEffect(() => {
    /**  非空检验（这里一般都是有值的，除非故障）  */
    if (isNull(canvas.current)) return;
    ripples.current = new Ripples(canvas.current, option);
    return () => ripples.current?.destroy();
  }, []);

  return ripples;
}

export type { Ripples, BackgroundRipplesProps, RipplesOptions, RippleImgUrl };
