/**
 * @module @enr/types
 * @file types.ts
 * @description 类型文件
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-02-02 16:55
 * @version 2.0.0-alpha.4
 * @lastModified 2026-02-02 17:06
 */

import type { RipplesOptions } from '../../customHooks/useRipples/types';
import type { PropsWithTagNameCustomRef } from '../type';

/**
 *
 *  背景涟漪的 props 类型
 *
 * - children  可选属性，定义子组件或子组件们
 * - style     可选属性，定义自定义外壳的样式，在内含 `children` 时生效
 * - option    可选属性，自定义涟漪的初始化属性
 *    - resolution 分辨率,纹理的尺寸，该项目中该值为纹理的宽和高，缺省为 `256`
 *    - dropRadius 扩撒半径，缺省值为 `20`
 *    - perturbation 扰动系数，缺省为   `0.03`
 *    - interactive 光标交互，缺省为 `true` ，关闭须显示传入 `false` 值
 *    - accelerating  加速光标移动触发，缺省为 `1`
 *    - crossOrigin 原始样式
 *    - imgUrl    原始背景图片地址
 *    - playingState 当前的播放状态，缺省为 `true` ，设定为 `false` 时并不关闭，而是暂停
 *    - raindropsTimeInterval 雨滴滴落的间隔，缺省为 `3600`，可设置区间为 `10 ~ 12000`
 *           该值还将影响无背景设置时默认背景的切换频率，几乎每两个雨滴落下就会切换一次背景
 *    - idleFluctuations  闲置波动，在光标交互不触发时，将触发模拟雨滴，缺省为 `true`
 *    - darkMode 暗黑模式，仅用于在默认的背景图时更改默认背景图的背景色，如果使用了 `imgUrl` 配置，请执行处理色差异常
 *
 */
export type BackgroundRipplesProps = PropsWithTagNameCustomRef<
  {
    /**
     * ## 可设定涟漪的参数
     *
     * - resolution  波速，值越小，波动越快。缺省为 `360`
     * - dropRadius  波动强度，值越小，波动效果越大，缺省值为 `12`
     * - perturbation 扰动系数，值越大，对原背景造成干涉越强，缺省为   `0.01`
     * - interactive 光标交互，缺省为 `true` ，关闭须显示传入 `false` 值
     * - accelerating  加速光标移动触发，类似于扰动系数，及作用与鼠标或手指触发，缺省为 `1`
     * - crossOrigin 原始样式
     * - imgUrl    原始背景图片地址
     * - playingState 当前的播放状态，缺省为 `true` ，设定为 `false` 时并不关闭，而是暂停
     * - raindropsTimeInterval 雨滴滴落的间隔，缺省为 `3650`，可设置区间为 `10 ~ 12000`，值越小，雨越大
     *   该值还将影响无背景设置时默认背景的切换频率，几乎每两个雨滴落下就会切换一次背景
     * - idleFluctuations  闲置波动，在光标交互不触发时，将触发模拟雨滴，缺省为 `true`
     * - darkMode 暗黑模式，仅用于在默认的背景图时更改默认背景图的背景色，如果使用了 `imgUrl` 配置，请执行处理色差异常
     */
    option?: RipplesOptions;
  },
  'div',
  RippleEle
>;

/**
 * ## 元素导出属性
 */
export type RippleEle = {
  /**  切换当前的状态  */
  toggleState(): boolean;
  /**  获取当前的状态  */
  state: boolean;
  /** 开启当前涟漪状态渲染 */
  play(): void;
  /**  暂停当前涟漪的渲染  */
  pause(): void;
  /**  设置属性 */
  set(options?: RipplesOptions): void;
};
