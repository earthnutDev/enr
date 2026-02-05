/**
 * @packageDocumentation
 * @module @enr/class-ripple
 * @file class-ripple.ts
 * @description ripple 类，整合其他类
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-22 03:03
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-05 19:24
 *
 */

import { loggerMiddleware, StateManager, type Reducer } from '@qqi/state';
import { dog, dun } from 'zza/log';
import { BuildBackground } from './class-build-background';
import { ElementEnvironment } from './class-element-environment';
import { EventAction } from './class-event-action';
import { ElementMeta } from './class-html-element-meta';
import { RippleParam } from './class-param';
import { RenderAction } from './class-render-action';
import { RenderData } from './class-render-data';
import { RippleGl } from './class-webgl';
import { defaultData } from './data-default';
import type { RipplesOptions, RippleState } from './types';

/**
 *
 * ## 水波动涟漪的效果
 *
 * 魔改自大佬的[jQuey 代码](https://github.com/sirxemic/jquery.ripples)
 */
export class Ripples {
  /** 状态管理 */
  private state: StateManager<RippleState>;
  /** 节点环境 */
  private element: ElementEnvironment;
  /**  使用参数  */
  private options: RippleParam;
  /** canvas 元素及其他数据信息 */
  private elementMeta: ElementMeta;
  /**  渲染数据  */
  private renderData: RenderData;
  /** 构建背景逻辑 */
  private buildBackground: BuildBackground;
  /** webGl 支持 */
  private gl: RippleGl;
  /** 渲染动作 */
  private renderAction: RenderAction;

  /** 事件动作 */
  private eventAction: EventAction;

  /**  初始化状态  */
  private initialized: boolean = false;

  private defaults = defaultData;

  /**
   * ## 构建 Ripple 对象
   * 该类并不能总是如期执行：
   *    - 执行设备不支持 WebGl
   * @param canvas canvas 元素 dom 节点
   * @param options 使用参数
   */
  constructor(canvas: HTMLCanvasElement, options?: RipplesOptions) {
    try {
      this.element = new ElementEnvironment(canvas);
    } catch (error) {
      const msg = '初始化故障';
      if (dun) {
        dog.error(msg, error);
      }
      throw new Error(msg);
    }
    if (dun) {
      dog('初始化参数', options);
    }
    Object.defineProperty(this, 'defaults', {
      value: defaultData,
      writable: false,
      enumerable: true,
      configurable: false,
    });
    this.options = new RippleParam(options);
    // 实际上，被监听的那些属性被没有被注入到初始化对象上，可能是 babel 使用转义时显式的将属性的描述符 enumerable 设定成了 false（默认值就是 false）
    const initData = {
      ...this.options,
      sizeChange: 0,
      styleChange: 0,
    } as unknown as RippleState;
    this.state = new StateManager(this.reducer, initData, {
      middleware: dun ? [loggerMiddleware] : [],
      afterDispatch(action, state) {
        if (dun) {
          dog.type = !1;
          dog.warn('执行', action, state);
          dog.type = !0;
        }
      },
    });
    this.elementMeta = new ElementMeta(this.options, this.element, this.state);
    /** 初始化带 this 指向的重加载回调  */
    this.renderData = new RenderData(); // 数据初始化
    this.buildBackground = new BuildBackground(this.options, this.elementMeta, this.renderData);
    this.gl = new RippleGl(this.element, this.options, this.elementMeta, this.buildBackground);
    {
      if (this.options.playingState) {
        // 插件初始化成功 // ? 什么插件？什么鬼注释
        this.options.visible = true;
        this.options.playingState = true;
      }
    }
    this.renderAction = new RenderAction(
      this.element,
      this.options,
      this.elementMeta,
      this.renderData,
      this.buildBackground,
      this.gl,
    );
    this.eventAction = new EventAction(
      this.element,
      this.options,
      this.elementMeta,
      this.renderData,
      this.buildBackground,
      this.gl,
      this.renderAction,
    );
    // 不知道这里为什么要手动绑定图片
    // this.gl.bindImage();
    this.state.subscribe({
      imgUrl: newValue => {
        if (dun) {
          dog('哇。订阅消息来的数据耶', newValue);
        }
        this.buildBackground.setImage();
      },
      // 用户设定的暗黑模式立即通知
      darkMode: newValue => {
        if (dun) {
          dog('哇。订阅消息来的数据耶', newValue);
        }
        // 只有在允许渐变且当前绘制下一个位默认背景时才允许立即添加透明纹理
        if (!this.buildBackground.forbiddenRunSide() && this.buildBackground.checkIsDefault()) {
          this.buildBackground.setTransparentTexture(true);
        }
      },
      /** 尺寸发生变化 */
      sizeChange: () => {
        if (dun) {
          dog('哇。订阅消息来的数据耶', '！这次居然是父级元素的尺寸发生了变化');
        }
        this.eventAction.reloadBackground();
      },
      /** 父级元素的样式发生变化 */
      styleChange: () => {
        if (dun) {
          dog('哇。订阅消息来的数据耶', '！这次居然是父级元素的样式发生了变化');
        }
        this.eventAction.reloadBackground();
      },
      playingState: newValue => {
        if (dun) {
          dog('哇，订阅来消息了耶！', 'playingState:', newValue);
        }
        if (newValue) {
          this.eventAction.reloadBackground();
        }
      },
    });
    this.state.subscribeAll(state => console.log(state));
    this.eventAction.beginWork();

    /// 注册一个当前主题模式的监听系统
    // window.matchMedia('(prefers-color-scheme: dark)');
  }

  /** 模拟雨滴下落  */
  raindropsFall() {
    this.eventAction.raindropsFall();
  }

  /**
   * 公共方法，触发
   * @param x
   * @param y
   * @param radius
   * @param strength
   */
  drop(x: number, y: number, radius: number, strength: number) {
    this.eventAction.drop(x, y, radius, strength);
  }
  /**
   * ## 缓进缓出
   */
  fade() {
    this.renderAction.fade();
  }

  /**  销毁  */
  destroy() {
    const { renderData } = this;
    if (dun) {
      dog('执行销毁');
    }
    this.state.destroy();
    this.eventAction.destroy();
    {
      /// 销毁当前对  WebGLRenderingContext 的引用
      if (this.gl) this.gl = null as unknown as never;
    }
    if (dun) {
      dog('销毁 render 证据');
    }
    renderData.destroy();
    /// 销毁执行上下文本身
    Object.keys(renderData).forEach(e => (renderData[e as never] = null as never));
    this.renderData = null as never;
    this.elementMeta.destroy();
  }

  /**
   * ## 展示元素
   *
   * 暂时不考虑 canvas 的手动显示。仅有涟漪状态的停启
   */
  // show() {
  //   this.elementMeta.showCanvas();
  // }

  // 该方法并没有被使用
  /**
   * ##隐藏元素
   *
   * 暂时不考虑 canvas 的手动显示。仅有涟漪状态的停启
   */
  // hide() {
  //   this.elementMeta.hideCanvas(); /// 恢复父级节点的背景样式
  // }

  /** 暂停动画涟漪状态   */
  pause() {
    // this.options.running = false;
    this.set('playingState', false);
  }

  /**  播放动画涟漪状态  */
  play() {
    // this.options.running = true;
    this.set('playingState', true);
  }

  /** 切换当前状态   */
  changePlayingState(): boolean {
    const { options } = this;
    if (dun) {
      dog.type = !1;
      dog('当前执行切换状态');
    }
    const newState = !options.playingState;
    // options.running = newState;
    this.set('playingState', newState);
    if (dun) {
      dog('更新后的状态', options.playingState);
      dog.type = !0;
    }
    return newState;
  }
  /**
   *  给初始化变量赋值
   * @param property
   * @param value
   */
  set(property: keyof RipplesOptions, value: unknown) {
    if (dun) {
      dog.type = !1;
      dog('设置属性', property);
    }
    // 该属性不允许被重新赋值
    if (property === 'loadingBackgroundColor') {
      return;
    }

    this.options[property] = value as never;

    // 数仓更新
    this.state.dispatch({
      type: property,
      payload: value,
    });
    if (dun) {
      dog('已通知家属');
      dog.type = !0;
    }
  }
  /**
   * 获取某一个参数的当前值
   * @param property 要获取的键
   */
  get<T extends keyof RipplesOptions>(property: T): RippleParam[T] {
    return this.options[property];
  }

  private readonly reducer: Reducer<RippleState> = (state, action) => {
    if (dun) {
      dog.type = true;
      dog('数据更新', action);
      dog.type = true;
    }
    switch (action.type) {
      case 'sizeChange':
      case 'styleChange':
        return { ...state, [action.type]: (this.state.getState()?.[action.type] || 0) + 1 };
      case 'darkMode':
      case 'imgUrl':
      case 'resolution':
      case 'dropRadius':
      case 'perturbation':
      case 'interactive':
      case 'accelerating':
      case 'crossOrigin':
      case 'playingState':
      case 'raindropsTimeInterval':
      case 'idleFluctuations':
      default:
        return { ...state, [action.type]: action.payload };
    }
  };
}
