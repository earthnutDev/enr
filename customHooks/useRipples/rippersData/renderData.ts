import { OriginStyle } from '../buildBackground/type';
import { Ripples } from '../ripplesClass';
import { Program, Textures } from '../types';
import { dog } from 'dog';
import { getBackgroundStyles } from '../buildBackground/utils/get-background-style';
import { enArr } from 'a-js-tools';
import { isEmptyArray } from 'a-type-of-js';
import { hideCssBackground } from '../buildBackground/utils/hide-css-background';
import { isNoneBackGroundColor, isNoneBackgroundImage } from '../tools';
import { restoreCssBackground } from '../buildBackground/utils/restore-css-background';

/**
 *
 * 原始数据类
 *
 * 记录了除参数数据外的运行数据
 *
 */
export class RipplesRenderData {
  /**  渲染数据流
   *
   * 该值在 init 中进行初始化
   */
  quad: WebGLBuffer = null as never;
  /**
   * 上一次雨滴滴落的时间
   *
   * 该时间更新触发时机：
   * - 2.2s 内没有事件触发
   * - 鼠标交互更新
   */
  lastRaindropsFallTime: number = 0; // 该值不为 0 将会导致
  /**  canvas 父级元素 该值在主 class 中初始化 */
  parentElement: HTMLElement;
  /**  父级元素的属性变化监听者  */
  mutationObserver: null | MutationObserver;
  /**  父级尺寸变化监听者  */
  resizeObserver: null | ResizeObserver;

  /**  渲染程序  */
  renderProgram!: Program;

  /**  图像资源的配置  */
  imageSource: string = '';

  /**  该值于初始化着色器时初始化  */
  dropProgram!: Program;

  /**  更新流  */
  updateProgram!: Program;

  /**  纹理  */
  textures: Textures = [];
  /**  背景纹理  */
  backgroundTexture: WebGLTexture = [];
  /**  纹理数据  */
  textureDelta!: Float32Array<ArrayBuffer>;
  /**    */
  framebuffers: WebGLFramebuffer[] = [];
  /**    */
  bufferWriteIndex: number = 0;
  /**    */
  bufferReadIndex: number = 1;
  /**  最原始的样式  */
  originStyle: OriginStyle;
  /**  上一次使用的样式  */
  lastUseStyle: OriginStyle;

  /** 事件  */
  events: {
    mousemove: (e: MouseEvent) => void;
    mousedown: (e: MouseEvent) => void;
    touchmove: (e: TouchEvent) => void;
    touchstart: (e: TouchEvent) => void;
  } = {} as never;

  /**  渲染 id  */
  animationFrameId: number = 0;

  /**
   * 构建 Ripple 的渲染数据
   *
   * @param canvas 使用初始化的 Canvas 元素
   * @param callback 执行的回调，这里要对页面背景进行更新
   * @param _Ripples  上一个回调在使用中的 this
   */
  constructor(canvas: HTMLCanvasElement, callback: () => void, _Ripples: Ripples) {
    this.parentElement = canvas.parentElement ?? document.body;
    //
    Reflect.apply(hideCssBackground, _Ripples, []);
    this.originStyle = this.lastUseStyle = getBackgroundStyles(this.parentElement);
    dog.type = false;
    dog('初始化时估计元素的尺寸', this.originStyle);
    // 注册监听属性变化
    this.mutationObserver = new MutationObserver(mutations => {
      dog.type = false;
      /**  变化值  */
      mutations.forEach(mutation => {
        if (mutation.target !== this.parentElement) return;
        if (mutation.type === 'attributes' && _Ripples.options.visible) {
          dog('父级元素的属性变更');
          dog('当前父级元素', this.parentElement);
          dog('当前属性监听者', this.mutationObserver);
          dog('当前尺寸变化监听者', this.resizeObserver);
          dog('当前执行的环境', this);
          dog('当前执行的上级', _Ripples, _Ripples.renderData, _Ripples.renderData === this);
          /**  上一次使用的值  */
          const lastStyleValues = Object.values(this.lastUseStyle);
          /**  现在的样式  */
          const currentStyle = getBackgroundStyles(this.parentElement);
          /** 本次的样式值  */
          const currentStyleValues = Object.values(currentStyle);
          dog('当前获取到的实际值，该值可能不作为使用值被储存', currentStyle);
          // 由于最后使用与原始备份的数据相同
          if (isEmptyArray(enArr.difference(lastStyleValues, currentStyleValues))) {
            dog('新值与旧值相同');
            return;
          }
          /**  当前没有背景图配置  */
          const isNoneImage = isNoneBackgroundImage(currentStyle.backgroundImage);

          /**  当前没有背景色配置  */
          const isNoneColor = isNoneBackGroundColor(currentStyle.backgroundColor);
          // 新值为空
          if (isNoneImage && isNoneColor) {
            dog('新值为空');
            return;
          }
          dog('由于样式不同触发了真实的事件回调');
          this.lastUseStyle = currentStyle; // 赋新值
          Reflect.apply(callback, _Ripples, []); // 触发事件
          Reflect.apply(hideCssBackground, _Ripples, []); // 触发隐藏元素的
        }
      });
      dog.type = true;
    });
    // 开始监听属性变化
    this.mutationObserver.observe(this.parentElement, {
      subtree: true, // 不监听子元素的变化
      attributes: true, // 监听属性的变化
      attributeFilter: ['class', 'style'], // 监听的属性
    });
    // 监听尺寸变化
    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(e => {
        // 非目标元素
        if (e.target !== this.parentElement) return;
        // 避免页面微变和子元素加载后页面的回流导致的重绘引起的微调
        dog('变化前的尺寸');
        dog('监听的父级元素发生了尺寸变化', entries);
        // 仅允许在 canvas 渲染时触发尺寸的监听计划
        Reflect.apply(callback, _Ripples, []);
      });
    });
    this.resizeObserver.observe(this.parentElement);
  }
  /**  销毁  */
  destroy() {
    if (this.animationFrameId) window.cancelAnimationFrame(this.animationFrameId);
    /// 恢复父级节点的背景样式
    Reflect.apply(restoreCssBackground, { renderData: this }, []);
    // 移除事件监听
    if (this.parentElement && this.events) {
      dog.warn('移除监听的事件');

      try {
        const { parentElement, events } = this;
        /// 移除监听的事件
        (Object.keys(events) as []).forEach(
          e => parentElement.removeEventListener && parentElement.removeEventListener(e, events[e]),
        );
        /// 移除属性
        if (parentElement.removeAttribute) parentElement.removeAttribute('data-ripples');
        {
          // 移除父级元素的监听，防止内存泄露
          this.mutationObserver?.takeRecords();
          this.mutationObserver?.disconnect();
          this.mutationObserver = null;
          dog(this.mutationObserver);
          this.resizeObserver?.disconnect();
          this.resizeObserver = null;
        }
      } catch (error) {
        dog.warn('移除监听者失败', error);
      }
    }
  }
}
