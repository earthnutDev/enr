/**
 * @module @enr/class-render-data
 * @file class-render-data.ts
 * @description 渲染数据类
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-22 02:56
 * @version 2.0.0-alpha.0
 * @lastModified 2026-03-25 20:27
 */

import { dog, dun } from 'zza/log';

/**
 * ## 原始数据类
 * 记录了除参数数据外的运行数据
 */
export class RenderData {
  /**
   * 上一次雨滴滴落的时间
   *
   * 该时间更新触发时机：
   * - 2.2s 内没有事件触发
   * - 鼠标交互更新
   */
  lastRaindropsFallTime: number = 0; // 该值不为 0 将会导致

  /**  图像资源的配置  */
  imageSource: string = '';

  /** 事件  */
  events: {
    mousemove: (e: MouseEvent) => void;
    mousedown: (e: MouseEvent) => void;
    touchmove: (e: TouchEvent) => void;
    touchstart: (e: TouchEvent) => void;
  } = {} as never;

  /**  渲染 id  */
  animationFrameId: number = 0;

  /**  缺省背景图时的 id  */
  transparentId: number = setTimeout(Boolean);
  /**  绘制进度 (千分制)*/
  drawProgress: number = 0;
  /**  是否处于绘制过渡状态  */
  isTransitioning: boolean = false;

  /**
   * ## 执行渐变
   * **非实际工作执行更新**，仅更新变量状态，在 requestAnimationFrame 中判定这些变量执行
   * 本来想以强制归 0 的方式让动画更流畅，但是这里（曾尝试在逆向渐变开始前直接归 0）归 0 又导致了渐变的不连贯，甚至是直接变白的效果
   */
  run() {
    //如果当前正处于渐变过程，直接退出，让渐变自己处理当前的状态
    if (this.isTransitioning) return;
    this.drawProgress = 0;
    this.isTransitioning = true;
  }

  /**  销毁  */
  destroy() {
    if (this.animationFrameId) window.cancelAnimationFrame(this.animationFrameId);
    if (this.transparentId) {
      if (dun) {
        dog('清理时间 id', this.transparentId);
      }
      clearTimeout(this.transparentId);
    }
  }
}
