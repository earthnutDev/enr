import { isNull } from 'a-type-of-js';
import { createCanvasElementBySize } from '../buildBackground/default-background/createCanvasElementBySize';
import { Ripples } from '../ripplesClass';

import { setTransparentTexture } from '../buildBackground/default-background';
import { forbiddenRunSide } from '../callback/can-side';
import { dog } from 'dog';

export type DrawImage = {
  /**  资源  */
  resource: HTMLCanvasElement | HTMLImageElement;
  /**  类型  */
  kind: 'image' | 'linear-gradient' | 'background-color' | 'default' | 'mix';
  /**  标识  */
  tag: string;
  /**  当前的宽  */
  width: number;
  /**  当前的高  */
  height: number;
};

/**  背景渐变的数据  */
export class FadeData {
  /**  背景页面的数据  */
  backgroundInfo: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0,
  };
  /**  缺省背景图时的 id  */
  transparentId: NodeJS.Timeout = setTimeout(Boolean);
  /**  最后使用
   *
   * 如果没有 toBeList 为空值，则当前渲染的为此纹理）绘制的图像
   */
  lastDrawImage: DrawImage;
  /**  当前绘制的图像
   *
   * 该值仅出现在需要渐变过程中，一旦渐变完成，实际渲染的值就成了最后渲染的值
   */
  toBeList: DrawImage[] = [];
  /**  绘制进度  */
  drawProgress: number = 0;
  /**  是否处于绘制过渡状态  */
  isTransitioning: boolean = false;
  /**  当前的状态 （暗黑模式） */
  #mediaQuery: MediaQueryList;
  /**  暗黑模式监听的事件  */
  #mediaQueryChange(ev: MediaQueryListEvent) {
    dog('当前获取', ev, this);
    this.isDark = ev.matches;
  }

  isDark: boolean = false;

  /**  执行渐变  */
  run() {
    //如果当前正处于渐变过程，直接退出，让渐变自己处理当前的状态
    if (this.isTransitioning) return;
    this.drawProgress = 0;
    this.isTransitioning = true;
  }
  /**  销毁  */
  destroy() {
    this.#mediaQuery.removeEventListener('change', this.#mediaQueryChange);
    dog('退出后取消执行', this.transparentId);
    if (this.transparentId) clearTimeout(this.transparentId);
  }
  /**  创建背景渐变的数据  */
  constructor(_Ripples: Ripples) {
    const { renderData } = _Ripples;
    let width: number, height: number;
    if (isNull(renderData)) {
      width = 10;
      height = 10;
    } else {
      // 获取边界尺寸并保存，防止后续步骤多次重复获取该数据并解析
      const styles = getComputedStyle(renderData.parentElement);
      width = parseInt(styles.width);
      height = parseInt(styles.height);
    }
    // 背景的尺寸
    this.backgroundInfo = {
      width,
      height,
    };
    // 最后使用的渲染项
    this.lastDrawImage = {
      resource: createCanvasElementBySize(width, height),
      width,
      height,
      kind: 'default',
      tag: '',
    };
    {
      /// 暗黑模式查询
      this.#mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDark = this.#mediaQuery.matches;
      this.#mediaQuery.addEventListener('change', this.#mediaQueryChange);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _ = this;
      Object.defineProperty(this.#mediaQuery, 'isDark', {
        get() {
          return _.isDark;
        },
        set(value: boolean) {
          _.isDark = value;
          // 在后续变化的进程都是默认
          if (!Reflect.apply(forbiddenRunSide, _Ripples, []))
            Reflect.apply(setTransparentTexture, _Ripples, [true]);
        },
      });
    }
  }
}
