/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName website
 * @FileName ripples/index.ts
 * @CreateDate  周六  12/07/2024
 * @Description ripples 水涟漪效果
 ****************************************************************************/
import { setCanvasStyle } from './tools';
import { RipplesData } from './rippersData';
import { RipplesOptions } from './types';
import { getRandomInt } from 'a-js-tools';
import { defaultData } from './rippersData/defaultData';
import { loadImage } from './buildBackground/load-image';
import { hideCssBackground } from './buildBackground/utils/hide-css-background';
import { RipplesRenderData } from './rippersData/renderData';
import { isFalse, isNull } from 'a-type-of-js';
import { initGL } from './init';
import { reloadBackground } from './callback/reload-background';
import { destroy } from './callback/destroy';
import { restoreCssBackground } from './buildBackground/utils/restore-css-background';
import { drop } from './callback/drop';
import { UseOptions } from './rippersData/useOptions';
import { fade } from './callback/fade';
import { FadeData } from './rippersData/fadeData';
import { setTransparentTexture } from './buildBackground/default-background';
import { forbiddenRunSide } from './callback/can-side';
import { dog } from 'dog';

/**
 *
 * ## 水波动涟漪的效果
 *
 * 魔改自大佬的[jQuey 代码](https://github.com/sirxemic/jquery.ripples)
 */
export class Ripples extends RipplesData {
  /**  渲染数据  */
  renderData: RipplesRenderData | null = null;
  /**  使用参数  */
  options: UseOptions;
  /**  背景使用的数据  */
  fadeData: FadeData;
  defaults = defaultData;
  /**  初始化状态  */
  initialized: boolean = false;

  /**
   * 构建 Ripple 对象
   */
  constructor(canvas: HTMLCanvasElement, options?: RipplesOptions) {
    super(canvas);
    dog('初始化参数', options);
    /// 定义不可写的默认值
    Object.defineProperties(this, {
      defaults: {
        value: this.defaults,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });

    this.options = new UseOptions({
      ...this.defaults,
      ...options,
    });

    /** 初始化带 this 指向的重加载回调  */
    const withThisReload = reloadBackground.bind(this);
    // 数据初始化
    this.renderData = new RipplesRenderData(canvas, withThisReload, this);
    // 渐变的数据
    this.fadeData = new FadeData(this);

    if (
      isFalse(this.initState) ||
      isNull(canvas.parentElement) ||
      isNull(this.config) ||
      isNull(this.gl)
    )
      this.initState = false;
    else {
      setCanvasStyle(canvas); /// 设置 canvas 的样式
      /// 初始化 gl 及渲染粒子（动画）
      Reflect.apply(initGL, this, []);
    }
    /// 注册一个当前主题模式的监听系统
    window.matchMedia('(prefers-color-scheme: dark)');
  }

  /** 模拟雨滴下落  */
  raindropsFall() {
    const { renderData, options, fadeData } = this;
    if (isNull(renderData)) return;
    const { backgroundInfo } = fadeData;
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

  /** 公共方法，触发 */
  drop(x: number, y: number, radius: number, strength: number) {
    Reflect.apply(drop, this, [x, y, radius, strength]);
  }
  /**
   * 缓进缓出
   */
  fade() {
    Reflect.apply(fade, this, []);
  }

  /**  销毁  */
  destroy() {
    Reflect.apply(destroy, this, []);
  }

  /**  展示元素 */
  show() {
    this.options.visible = true;
    this.canvas.style.visibility = 'visible';
    Reflect.apply(hideCssBackground, this, []);
  }

  /** 隐藏元素 */
  hide() {
    this.options.visible = false;
    this.canvas.style.visibility = 'hidden';
    Reflect.apply(restoreCssBackground, this, []); /// 恢复父级节点的背景样式
  }

  /** 暂停动画涟漪状态   */
  pause() {
    this.options.running = false;
  }

  /**  播放动画涟漪状态  */
  play() {
    this.options.running = true;
  }
  /** 切换当前状态   */
  changePlayingState() {
    const { options } = this;
    dog('当前执行切换状态');
    options.running = !options.running;
    dog('更新后的状态', options.running);
  }
  /**  给初始化变量赋值  */
  set(property: keyof RipplesOptions, value: unknown) {
    dog('设置属性', property);
    if (property === 'imgUrl') {
      this.options.imgUrl = value as never;
      Reflect.apply(loadImage, this, []);
    } else if (property === 'darkMode') {
      this.options.darkMode = value as boolean;
      dog(Reflect.apply(forbiddenRunSide, this, []));
      if (!Reflect.apply(forbiddenRunSide, this, []))
        Reflect.apply(setTransparentTexture, this, [true]);
    } else this.options[property] = value as never;
  }
}
