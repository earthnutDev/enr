/**
 * @packageDocumentation
 * @module @enr/class-element-html-meta
 * @file class-html-element-meta.ts
 * @description 构建元素节点数据
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-21 21:32
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-03 12:53
 */

import type { StateManager } from '@qqi/state';
import { setStyle } from 'a-element-inline-style';
import { enArr } from 'a-js-tools';
import { isEmptyArray } from 'a-type-of-js';
import { dog, dun } from 'zza/log';
import type { ElementEnvironment } from './class-element-environment';
import type { RippleParam } from './class-param';
import { isNoneBackGroundColor, isNoneBackgroundImage } from './tools';
import type { OriginStyle, RippleState } from './types';

/**
 * ## 渲染的 canvas 及其父级元素数据
 */
export class ElementMeta {
  /**
   *  ## 背景页面的数据
   */
  backgroundInfo: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0,
  };

  /**  最原始的样式  */
  originStyle: OriginStyle;
  /**  上一次使用的样式  */
  lastUseStyle: OriginStyle;

  /**
   * ## 暗黑模式
   * 该值是通过检测当前的宿主环境实际值，在实际使用时将被用户设定值覆盖
   */
  private _isDark: boolean = false;
  /**
   * ## 当前是否为暗黑模式
   *
   * 用户设定 > 宿主环境检测值
   */
  get isDark(): boolean {
    return this.options.darkMode ?? this._isDark ?? false;
  }

  /**
   * ## 设定环境检测暗黑模式值
   */
  set isDark(newValue: boolean) {
    this._isDark = Boolean(newValue);
  }
  /**
   * ## 当前的状态 （暗黑模式）
   */
  mediaQuery: MediaQueryList;

  /**
   * ## 父级元素的属性变化监听者
   */
  mutationObserver: null | MutationObserver = null;

  /**
   * ## 父级尺寸变化监听者
   */
  resizeObserver: null | ResizeObserver = null;

  /** 首次设定父级元素的样式大概率将触发父元素的尺寸变化，且不可避免，只能通过过滤来忽略本次的渐变 */
  isFirstChange: boolean = true;

  /**
   *
   * @param options 用户设定数据
   * @param element canvas 元素 dom 节点
   * @param state
   */
  constructor(
    private readonly options: RippleParam,
    private readonly element: ElementEnvironment,
    private readonly state: StateManager<RippleState>,
  ) {
    let width: number, height: number;
    // 获取边界尺寸并保存，防止后续步骤多次重复获取该数据并解析
    const styles = globalThis.getComputedStyle(this.element.parentNode);
    width = parseInt(styles.width);
    height = parseInt(styles.height);
    // 背景的尺寸
    this.backgroundInfo = {
      width,
      height,
    };
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.setCanvasStyle(); /// 设置 canvas 的样式
    this.mediaQueryChange = this.mediaQueryChange.bind(this); // 防走丢
    this.observerMediaQueryChange();
    // 想不明白为什么初始化之前还要放到 class-event-action 中
    this.originStyle = this.lastUseStyle = this.getBackgroundStyles();
    this.initializeResizeObserve(); // 初始化监听父级元素的属性变换（尺寸、样式）
  }

  /**
   * ## 监听媒体模式的变化
   */
  private observerMediaQueryChange() {
    /// 暗黑模式查询
    this.isDark = this.mediaQuery.matches;
    // 下面的检测其实是没必要的，因为初始化的时候本身就会考虑当前的模式
    // this.canDispatchDarkChange(); // 初始化 isDark 值后需要立即更新
    this.mediaQuery.addEventListener('change', this.mediaQueryChange);
  }

  /**
   *  暗黑模式监听的事件
   * @param ev 事件
   */
  private mediaQueryChange(ev: MediaQueryListEvent) {
    if (dun) {
      dog('当前获取', ev, this);
    }
    this.isDark = ev.matches;
    this.canDispatchDarkChange();
  }

  /**
   * ## 是否可以触发暗黑更新
   */
  private canDispatchDarkChange() {
    if (this.options.darkMode === undefined) {
      this.state.dispatch({
        type: 'darkMode',
        payload: this.isDark,
      });
    }
  }

  /**
   * ## 初始化尺寸变化监听
   */
  private initializeResizeObserve() {
    this.showCanvas(); /// 这里注释了隐藏
    const { options, element } = this;
    const { parentNode } = element;
    if (dun) {
      dog('初始化时估计元素的尺寸', this.originStyle);
    }
    // 注册监听属性变化
    this.mutationObserver = new MutationObserver(mutations => {
      /**  变化值  */
      mutations.forEach(mutation => {
        if (mutation.target !== parentNode) return;
        if (mutation.type === 'attributes' && options.visible) {
          if (dun) {
            dog('父级元素的属性变更');
            dog('当前父级元素', parentNode);
            dog('当前属性监听者', this.mutationObserver);
            dog('当前尺寸变化监听者', this.resizeObserver);
            dog('当前执行的环境', this);
          }
          /**  上一次使用的值  */
          const lastStyleValues = Object.values(this.lastUseStyle ?? {});
          /**  现在的样式  */
          const currentStyle = this.getBackgroundStyles();
          /** 本次的样式值  */
          const currentStyleValues = Object.values(currentStyle);
          if (dun) {
            dog('当前获取到的实际值，该值可能不作为使用值被储存', currentStyle);
          }
          // 由于最后使用与原始备份的数据相同
          if (isEmptyArray(enArr.difference(lastStyleValues, currentStyleValues))) {
            if (dun) {
              dog('新值与旧值相同');
            }
            return;
          }
          /**  当前没有背景图配置  */
          const isNoneImage = isNoneBackgroundImage(currentStyle.backgroundImage);

          /**  当前没有背景色配置  */
          const isNoneColor = isNoneBackGroundColor(currentStyle.backgroundColor);
          // 新值为空
          if (isNoneImage && isNoneColor) {
            if (dun) {
              dog('新值为空');
            }
            return;
          }
          if (dun) {
            dog('由于样式不同触发了真实的事件回调');
          }
          this.lastUseStyle = currentStyle; // 赋新值
          {
            // 放到消息订阅中触发事件
            // TODO ： 校验更改是否有误
            // this.showCanvas(); // 触发隐藏元素的
            this.state.dispatch({
              type: 'styleChange',
            });
          }
        }
      });
    });

    // 开始监听属性变化
    this.mutationObserver.observe(parentNode, {
      subtree: true, // 不监听子元素的变化
      attributes: true, // 监听属性的变化
      attributeFilter: ['class', 'style'], // 监听的属性
    });
    // 监听尺寸变化
    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(e => {
        // 非目标元素
        if (e.target !== parentNode) return;
        // 避免页面微变和子元素加载后页面的回流导致的重绘引起的微调
        if (dun) {
          dog('监听的父级元素发生了尺寸变化', entries);
        }
        if (this.isFirstChange) {
          this.isFirstChange = false;
          if (dun) {
            dog.warn('跳过本次重新加载');
          }
        } else {
          // 仅允许在 canvas 渲染时触发尺寸的监听计划
          this.state.dispatch({
            type: 'sizeChange',
          });
        }
      });
    });
    this.resizeObserver.observe(parentNode);
  }

  /**
   * ## 隐藏背景
   *
   * 触发于
   * - 手动恢复背景 webGl 的显示
   * - 初始化时隐藏
   * - 父级样式属性发生变更的时候
   */
  showCanvas() {
    const { parentNode, canvas } = this.element;
    if (!parentNode) return;
    this.options.visible = true;
    canvas.style.visibility = 'visible';
    if (dun) {
      dog('重写父级的行内样式');
    }
    // renderData.dropProgram = [];
    // 检测是否更改了行内样式或是重写了该样式
    // 不再重置父级元素的样式属性
    // eslint-disable-next-line no-constant-condition
    if (false) {
      [
        // ['background', 'transparent'],
        ['background-image', 'none'],
        ['background-color', 'transparent'],
      ].forEach(e => parentNode.style.setProperty(e[0], e[1], 'important'));
      if (dun) {
        dog('重写后的父级的行内背景样式', parentNode.style.background);
        dog('重写后的父级的行内背景色样式', parentNode.style.backgroundColor);
        dog('重写后的父级的行内背景图样式', parentNode.style.backgroundImage);
        dog('暂存的原始样式', this.originStyle);
        dog('暂存的最后获取样式', this.lastUseStyle);
      }
    }
  }

  /**
   *  ## 获取父级元素的样式
   */
  getBackgroundStyles(): OriginStyle {
    const { parentNode } = this.element;
    const computedStyle = globalThis?.getComputedStyle(parentNode);
    const style = parentNode.style;
    return {
      inlineBackground: style.background,
      inlineBackgroundColor: style.backgroundColor,
      inlineBackgroundImage: style.backgroundImage,
      backgroundColor: computedStyle.backgroundColor,
      backgroundImage: computedStyle.backgroundImage,
      backgroundSize: computedStyle.backgroundSize,
      backgroundPosition: computedStyle.backgroundPosition,
      backgroundRepeat: computedStyle.backgroundRepeat,
      backgroundClip: computedStyle.backgroundClip,
      backgroundOrigin: computedStyle.backgroundOrigin,
      backgroundAttachment: computedStyle.backgroundAttachment,
      position: computedStyle.position,
      width: parseInt(computedStyle.width),
      height: parseInt(computedStyle.height),
    };
  }

  /**
   * 恢复背景样式
   *
   * 在使用过程中，可能会切换 webGL 的显隐状态，而手动处理背景的更替
   */
  hideCanvas() {
    const { parentNode, canvas } = this.element;
    const { originStyle } = this;
    if (!originStyle) return; // 尚未设定保存的元素样式
    this.options.visible = false;
    canvas.style.visibility = 'hidden';
    // 因不再重写父级元素的样式，也无需进行恢复
    // eslint-disable-next-line no-constant-condition
    if (false) {
      // parentElement.style.setProperty('background', originStyle.inlineBackground);
      parentNode.style.setProperty('background-image', originStyle.inlineBackgroundImage);
      parentNode.style.setProperty('background-color', originStyle.inlineBackgroundColor);
    }
  }

  /**
   * ## 给 canvas 设置样式
   */
  setCanvasStyle() {
    const { parentNode, canvas } = this.element;
    if (!parentNode) return; // 未能正确捕获父级元素 (已规避了该问题)
    const parentElement = canvas.parentElement!;
    canvas.width = parentElement.clientWidth;
    canvas.height = parentElement.clientHeight;
    // 给 canvas 元素赋值行内样式
    setStyle(canvas, {
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      pointerEvents: 'none',
    });
  }

  /**
   * ## 注销事件
   */
  destroy() {
    this.hideCanvas(); /// 恢复父级节点的背景样式
    this.mediaQuery?.removeEventListener('change', this.mediaQueryChange);
    {
      // 移除父级元素的监听，防止内存泄露
      this.mutationObserver?.takeRecords();
      this.mutationObserver?.disconnect();
      this.mutationObserver = null;
      if (dun) {
        dog(this.mutationObserver);
      }
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
    }
  }
}

// if (isNull(document.querySelector(`style#${id}`))) {
//   const style = this.styleElement;
//   style.id = id;
//   style.innerHTML = `
//   .earthnut-ripples {
//     position: relative;
//     z-index: 0;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     transform: translate(0,0);
//   }
//   `;
//   const head = document.head;
//   if (head.prepend) head.prepend(style);
//   else head.insertBefore(style, head.firstChild);
// }
