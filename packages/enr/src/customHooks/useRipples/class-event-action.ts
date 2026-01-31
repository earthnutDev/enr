/**
 * @packageDocumentation
 * @module @enr/class-event-action
 * @file class-event-action.ts
 * @description 交互事件
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-23 01:23
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-01 06:00
 */

import { debounce, getRandomInt } from 'a-js-tools';
import { dog, dun } from 'zza/log';
import { BuildBackground } from './class-build-background';
import type { ElementEnvironment } from './class-element-environment';
import { ElementMeta } from './class-html-element-meta';
import { RippleParam } from './class-param';
import { RenderAction } from './class-render-action';
import { RenderData } from './class-render-data';
import { RippleGl } from './class-webgl';

/**
 *
 */
export class EventAction {
  /**
   *
   * @param element
   * @param options 用户设定参数
   * @param elementMeta  执行动画
   * @param renderData 渲染数据
   * @param buildBackground 构建背景数据
   * @param rippleGl WebGl 支持
   * @param renderActon 渲染动作
   */
  constructor(
    private readonly element: ElementEnvironment,
    private readonly options: RippleParam,
    private readonly elementMeta: ElementMeta,
    private readonly renderData: RenderData,
    private readonly buildBackground: BuildBackground,
    private readonly rippleGl: RippleGl,
    private readonly renderActon: RenderAction,
  ) {
    this.beginWork = this.beginWork.bind(this);
    this.setupPointerEvents();
  }

  /**
   * 初始化事件
   */
  private setupPointerEvents() {
    const { options, renderData, element } = this;
    const { parentNode } = element;
    const { events } = renderData;
    /// visible、running 的值应当取当前值而不是提前取到固定值
    /**  当前是否允许鼠标操作  */
    const pointerEventsEnabled = () => options.visible && options.running && options.interactive;
    /**
     *  触发滴落效果
     * @param pointer
     * @param big
     */
    const _dropAtPointer = (pointer: MouseEvent | Touch, big: boolean = false) => {
      if (pointerEventsEnabled()) {
        renderData.lastRaindropsFallTime = Date.now(); /// 更新上一次触发时机，延迟主动触发的雨滴
        this.dropAtPointer(pointer, options.dropRadius * (big ? 1.5 : 1), big ? 0.03 : 0.01);
      }
    };
    // 鼠标划过
    events.mousemove = (e: MouseEvent) => {
      for (let i = options.accelerating; i--; ) _dropAtPointer(e);
    };
    // 手持端手指划过
    events.touchmove = events.touchstart = (e: TouchEvent) => {
      const touches = e.touches;
      for (let i = 0; i < touches.length; i++) _dropAtPointer(touches[i]);
    };
    // 鼠标点击
    events.mousedown = (e: any) => _dropAtPointer(e, true);

    //   注册鼠标或触摸事件
    (Object.keys(events) as []).forEach(e =>
      parentNode?.addEventListener(e, events[e], { passive: true }),
    );
  }

  /**
   * ##  触发的点
   * @param pointer
   * @param radius
   * @param strength
   */
  private dropAtPointer(pointer: MouseEvent | Touch, radius: number, strength: number) {
    const { element } = this;

    const { parentNode } = element;
    const style = window.getComputedStyle(parentNode);
    const borderLeft = parseInt(style.borderLeftWidth) || 0,
      borderTop = parseInt(style.borderTopWidth) || 0;
    /**
     *
     * pointer.pageX 点击事件触发的位置相对于页面来说的，包含滚动的距离
     * this.parentElement.offsetLeft 父元素左上角相对于定位元素的左边界偏移像素值
     * borderLeft 边框的宽度
     */
    const parentPosition = parentNode.getBoundingClientRect();
    const dropX = pointer.clientX - parentPosition.left - borderLeft;
    const dropY = pointer.clientY - parentPosition.top - borderTop;
    this.drop(dropX, dropY, radius, strength);
  }

  /**  */
  private setCanvasSize = debounce((canvas, width, height) => {
    canvas.width = width;
    canvas.height = height;
    if (dun) {
      dog('触发真实的设置 canvas 尺寸');
    }
  }, 1000);

  /**
   * 重新加载背景图片
   *
   *
   * 为了避免在高频父元素尺寸变化时触发 canvas 的 width、height 属性变化。
   * 使用防抖进行处理设置 canvas 的 width、height 值
   *
   */
  reloadBackground() {
    if (dun) {
      dog.type = true;
    }
    const { elementMeta, element } = this;
    const { backgroundInfo } = elementMeta;
    const { parentNode, canvas: node } = element;
    const width = parentNode.offsetWidth,
      height = parentNode.offsetHeight,
      oldWidth = node.width,
      oldHeight = node.height;
    if (dun) {
      dog(
        '渲染尺寸',
        width,
        height,
        oldHeight,
        oldWidth,
        Math.abs(oldWidth - width),
        Math.abs(oldHeight - height),
      );
    }
    if (width < 3 || height < 3) {
      if (dun) {
        dog('尺寸太小，直接忽略渲染');
      }
      return;
    }
    // canvas.width =
    backgroundInfo.width = width;
    // canvas.height =
    backgroundInfo.height = height;

    // TODO 此处修改，未验明效果
    this.setCanvasSize(element.canvas, width, height);
    if (dun) {
      dog('触发再次加载背景');
    }
    this.buildBackground.setImage();
  }

  /**
   *  触发滴落效果
   * @param x
   * @param y
   * @param radius
   * @param strength
   */
  drop(x: number, y: number, radius: number, strength: number) {
    const { options, rippleGl, element } = this;
    const { parentNode } = element;
    const { gl, dropProgram, textures, framebuffers, bufferWriteIndex, bufferReadIndex } = rippleGl;
    const { resolution } = options;
    /**  元素的宽  */
    const parentWidth = parentNode.offsetWidth;
    /**  元素的高  */
    const parentHeight = parentNode.offsetHeight;
    /**  元素较长的一边  */
    const longestSide = Math.max(parentWidth, parentHeight);
    radius = radius / longestSide;
    const dropPosition = new Float32Array([
      (2 * x - parentWidth) / longestSide,
      (parentHeight - 2 * y) / longestSide,
    ]);

    gl.viewport(0, 0, resolution, resolution);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[bufferWriteIndex]);
    rippleGl.bindTexture(textures[bufferReadIndex]);
    gl.useProgram(dropProgram.id);
    gl.uniform2fv(dropProgram.locations.center, dropPosition);
    gl.uniform1f(dropProgram.locations.radius, radius);
    gl.uniform1f(dropProgram.locations.strength, strength);
    rippleGl.drawQuad();
    rippleGl.swapBufferIndices();
  }

  /** 模拟雨滴下落  */
  raindropsFall() {
    const { renderData, options, elementMeta } = this;
    const { backgroundInfo } = elementMeta;
    const { lastRaindropsFallTime } = renderData;
    const { raindropsTimeInterval, dropRadius } = options;
    const now = Date.now();
    /**  模拟雨滴坠落  */
    if (now - lastRaindropsFallTime < raindropsTimeInterval) return;
    renderData.lastRaindropsFallTime = now; // 设置新的时间

    const getValue = (size: number) => getRandomInt(size || 1);

    const { width, height } = backgroundInfo;
    this.drop(getValue(width), getValue(height), dropRadius, 0.03);
  }

  /**
   * ## 开启绘制
   */
  beginWork() {
    const { renderData, options, elementMeta, element } = this;
    const { parentNode } = element;
    const { isTransitioning } = renderData;
    const { running, idleFluctuations, lastRunningState } = options;
    // 渲染
    renderData.animationFrameId = requestAnimationFrame(() => this.beginWork());

    {
      // 获取边界尺寸
      const styles = getComputedStyle(parentNode);
      elementMeta.backgroundInfo = {
        width: parseInt(styles.width),
        height: parseInt(styles.height),
      };
    }
    ///  计算当前的纹理边界及背景图
    this.renderActon.computeTextureBoundaries();
    // 当前状态为执行
    if (running) {
      // 上一次状态为不执行
      if (!lastRunningState) {
        if (dun) {
          console.error('100');
        }
        options.lastRunningState = true; // 设置下次执行状态
        elementMeta.hideCssBackground(); // 展示背景
      }
      // 是否设置了闲时动画
      if (idleFluctuations) this.raindropsFall();
      /**
       *  TODO  这里调用触发了错误
       *
       *  可能是值  isTransitioning 出现了故障
       *
       *  Cannot read properties of undefined (reading 'resource')
       */
      if (isTransitioning) this.renderActon.fade(); // 当前绘制图像间转换
      this.renderActon.update(); // 数据更新
      this.renderActon.draw(); // 渲染
    }
    // 当前状态为未执行但是上一次是在执行（清理状态）
    else if (lastRunningState) {
      options.lastRunningState = false;
      elementMeta.restoreCssBackground();
    }
  }

  /**
   * ## 销毁事件
   */
  destroy() {
    const { renderData, element } = this;
    const { parentNode } = element;
    if (!parentNode || !renderData.events) return;
    // 移除事件监听
    if (dun) {
      dog('移除监听的事件');
    }
    try {
      /// 移除监听的事件
      (Object.keys(renderData.events) as []).forEach(e =>
        parentNode?.removeEventListener(e, renderData.events[e]),
      );
      parentNode?.removeAttribute('data-ripples'); /// 移除属性
    } catch (error) {
      if (dun) {
        dog('移除监听者失败', error);
      }
    }
  }
}
