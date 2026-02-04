/**
 * @module @enr/class-event-action
 * @file class-event-action.ts
 * @description 交互事件
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-23 01:23
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-04 06:46
 */

import { debounce, getRandomInt } from 'a-js-tools';
import { dog, dun } from 'zza/log';
import type { BuildBackground } from './class-build-background';
import type { ElementEnvironment } from './class-element-environment';
import type { ElementMeta } from './class-html-element-meta';
import type { RippleParam } from './class-param';
import type { RenderAction } from './class-render-action';
import type { RenderData } from './class-render-data';
import type { RippleGl } from './class-webgl';

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
   * @param renderAction 渲染动作
   */
  constructor(
    private readonly element: ElementEnvironment,
    private readonly options: RippleParam,
    private readonly elementMeta: ElementMeta,
    private readonly renderData: RenderData,
    private readonly buildBackground: BuildBackground,
    private readonly rippleGl: RippleGl,
    private readonly renderAction: RenderAction,
  ) {
    this.beginWork = this.beginWork.bind(this); // 防丢
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
    const pointerEventsEnabled = () =>
      options.visible && options.playingState && options.interactive;
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
   * @param x 横坐标
   * @param y 纵坐标
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
    if (dun) {
      dog.type = false;
    }
    const { renderData, options, renderAction } = this;
    const { playingState, lastRunningState } = options;

    renderData.animationFrameId = requestAnimationFrame(() => this.beginWork());
    if (dun) {
      dog('测试执行', playingState, lastRunningState);
    }
    // TODO：不知道为什么以前这么写，但是感觉没有道理先注释了
    // {
    //   // 获取边界尺寸
    //   const styles = getComputedStyle(parentNode);
    //   elementMeta.backgroundInfo = {
    //     width: parseInt(styles.width),
    //     height: parseInt(styles.height),
    //   };
    // }
    ///  计算当前的纹理边界及背景图
    renderAction.computeTextureBoundaries();

    // 当前状态为执行
    if (playingState) {
      // 上一次状态为不执行
      // 当前是初次执行、重新开始执行涟漪动画
      if (!lastRunningState) {
        options.toggleLastRunningState(); // 更新下次执行状态
      }
      if (!options.visible) {
        // TODO： 再这里更新此状态不知道会不会影响第一次渲染
        this.elementMeta.showCanvas(); // 如果当前元素被隐藏则显示元素
      }
      this.rendering();
    } else if (lastRunningState) {
      this.coasting(); // 当前状态为未执行但是上一次是在执行（清理状态）
    } else {
      // 上一次是停止状态，当前依旧是停止状态
    }
  }

  /** 执行（无状态，管你是正常执行还是反向销毁） */
  private rendering() {
    const { renderData, renderAction, options } = this;
    const { isTransitioning } = renderData;
    const { idleFluctuations } = options;
    // 是否设置了闲时动画
    if (idleFluctuations) {
      this.raindropsFall();
    }
    /**
     *  TODO  这里调用触发了错误
     *  可能是值  isTransitioning 出现了故障
     *  Cannot read properties of undefined (reading 'resource')
     */
    if (isTransitioning) {
      renderAction.fade(); // 当前绘制图像间转换（更新背景图）
    }
    renderAction.update(); // 数据更新
    renderAction.draw(); // 渲染
  }

  /**
   * ## 缓停
   *
   * 暂停时逆向加载
   */
  private coasting() {
    const { options, renderData, buildBackground: bbg } = this;
    const lastTag = 'last-run-tag';
    if (dun) {
      dog.type = false;
      dog('当前执行');
    }
    // 当当前是第一次执行，且执行已经有了 30% 的执行进度，那么直接切换隐藏当前的显示
    if (bbg.lastDrawImage.tag === lastTag) {
      if (dun) {
        dog.type = true;
        dog('当前执行的进度', renderData.drawProgress);
        dog('当前是否是第一次执行:', options.firstRun);
        dog('当前执行是否是设置的最后图', bbg.lastDrawImage);
        dog.type = false;
      }
      options.firstRun = true; // 重置首次加载的状态（重新加载是缓渐变）
      options.toggleLastRunningState(); // 更新上一次执行状态
      bbg.lastDrawImage.tag = 'first-run'; // 重要：下次开头可能因误判直接隐藏 Canvas
      this.elementMeta.hideCanvas(); // 隐藏 canvas
    } else {
      if (dun) {
        dog.type = true;
        dog('当前显示的状态', bbg.lastDrawImage);
      }
      // 当前不是第一次执行，或当前为首次执行且已经初见影像
      // 不能直接通过隐藏背景来让背景消失，这样会导致背景在视觉上的突变
      if (!bbg.currentDrawImage.tag.endsWith(lastTag)) {
        bbg.toBeList.push(bbg.createTransparentTexture(lastTag));
        renderData.run(); // 开启执行渐变
        // 曾尝试在这里调用状态时强制让渐变归零，而这导致了下一个状态直接渲染了跳跃式背景，而导致页面突变
      }
      this.rendering();
    }
    if (dun) {
      dog.type = true;
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
