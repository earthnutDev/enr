/**
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @file types.ts
 * @since  周二  12/17/2024
 * @description BackgroundRipples 的类型声明文件
 * @lastModified 2026-02-07 08:06
 */

/**
 * ## 图片源
 *
 */
export type ImageCrossOrigin = 'anonymous' | 'use-credentials' | 'no-cors';

/**
 *
 * WebGL 程序
 *
 */
export interface Program {
  id: WebGLProgram;
  uniforms: { [x: string]: Float32Array };
  locations: {
    [x: string]: WebGLUniformLocation;
  };
}
/**
 * 设定的元素背景的 url 地址
 *
 * 缺省为 `null`
 */
export type RippleImgUrl = string | string[] | null;

export type RipplesUseOptions = {
  /**
   * ## 波速
   *
   * 作用为波传播的速度，值越大，波传播的越慢
   *
   * 缺省为 `360`
   */
  resolution: number;
  /**
   * ##  波动强度
   *
   * 值越小，波动越明显
   *
   * 缺省为 `12`
   */
  dropRadius: number;
  /**
   * ## 扰动系数
   *
   * 缺省 `0.01`
   *
   * 取之范围 `0.01 - 1`
   *
   * 值越大，扰动效果越明显
   */
  perturbation: number;
  /**
   * 是否开启光标滑动轨迹
   *
   * 缺省为  `true`
   */
  interactive: boolean;
  /**
   * 加速光标移动触发，缺省为 `1`
   *
   *
   * 由于大佬原方法在光标触发 mousemove 时不怎么明显
   *
   * 所以以倍级触发会让波动更加明显
   *
   * 可设置区间为 `2 - 100`
   */
  accelerating: number;
  /**
   * ##  原设定的背景图片
   *
   * 图片源
   */
  crossOrigin: ImageCrossOrigin;
  /**
   * ## 设定的元素背景的 url 地址
   *
   * 缺省为 `null`
   */
  imgUrl: RippleImgUrl;
  /**
   * ## 当前涟漪的状态
   *
   * 缺省为 `true` ， 即涟漪触发正在执行
   */
  playingState: boolean;
  /**
   * ## 雨滴滴落的时间间隔
   *
   * 单位为 ms
   *
   * 缺省值为 `3600`
   *
   *
   * 可设置区间为 `10 ~ 12000`
   *
   *   该值还将影响无背景设置时默认背景的切换频率，几乎每两个雨滴落下就会切换一次背景
   */
  raindropsTimeInterval: number;
  /**
   * ## 闲置波动
   *
   * 在光标交互不触发时，将触发模拟雨滴
   *
   * 缺省为 `true`
   */
  idleFluctuations: boolean;
  /**
   *  ## 是否为暗黑模式
   *
   *  在使用默认的主题设置时，当页面使用暗黑模式时出现了文本看不清的现象
   *
   */
  darkMode: boolean | undefined;
  /**
   * ## 初始化时背景色
   * 默认为透明，可传入一个色值，或双色值数组。
   *
   * 当传入的值为双色值数组时：
   *
   *  - 第一个色值将被用作默认背景加载色（亮）
   *  - 第二个色值将被用作黑色主题背景加载色（暗）
   *
   * **该值仅在初始化用到，后续更改该值*直接*舍弃**
   */
  loadingBackgroundColor: string | [string] | [string, string];
};

/**
 *
 * 涟漪设定参数
 *
 * - accelerating  加速光标移动触发，类似于扰动系数，及作用与鼠标或手指触发，缺省为 `1`
 * - crossOrigin 原始样式
 * - darkMode 暗黑模式，仅用于在默认的背景图时更改默认背景图的背景色，如果使用了 `imgUrl` 配置，请执行处理色差异常
 * - dropRadius 波动强度，值越小，波动效果越大，缺省值为 `12`
 * - imgUrl    原始背景图片地址
 * - idleFluctuations  闲置波动，在光标交互不触发时，将触发模拟雨滴，缺省为 `true`
 * - interactive 光标交互，缺省为 `true` ，关闭须显示传入 `false` 值
 * - loadingBackgroundColor 初始化加载时背景色，可为单色值或双色值数组（**该值仅在初始化用到，后续更改该值直接舍弃**）
 * - perturbation 扰动系数，值越大，对原背景造成干涉越强，缺省为   `0.01`
 * - playingState 当前的播放状态，缺省为 `true` ，设定为 `false` 时并不关闭，而是暂停
 * - raindropsTimeInterval 雨滴滴落的间隔，缺省为 `3650`，可设置区间为 `10 ~ 12000`，值越小，雨越大
 * - resolution 分波速，值越小，波动越快。缺省为 `360`
 *   该值还将影响无背景设置时默认背景的切换频率，几乎每两个雨滴落下就会切换一次背景
 */
export type RipplesOptions = Partial<RipplesUseOptions>;

/**
 * ## 初始默认值（内部使用）
 */
export interface RipplesDefaultData {
  /**  默认的图像地址  */
  imgUrl: null;
  /**
   * ## 波速
   *
   * 作用为波传播的速度，值越大，波传播的越慢
   */
  resolution: 360;
  /**
   * ## 波动强度
   *
   * 值越小，波动越明显
   */
  dropRadius: 12;
  /**
   * ##  扰动系数
   *
   * 取之范围 `0.01 - 1`
   *
   * 值越大，扰动效果越明显
   */
  perturbation: 0.01;
  /** 是否开启光标滑动轨迹   */
  interactive: true;
  /**
   * ## 图片源
   */
  crossOrigin: 'no-cors';
  /**
   * ## 当前涟漪的状态
   *
   * 缺省为 `true` ， 即涟漪触发正在执行
   */
  playingState: true;
  /**
   * ## 加速光标移动触发
   *
   * 所以以倍级触发会让波动更加明显
   *
   * 可设置区间为 `2 - 100`
   */
  accelerating: 1;
  /**
   * ## 雨滴滴落的时间间隔
   *
   * 单位为 ms，可设置区间为 `10 ~ 12000`
   *
   * 该值**还将影响无背景设置时默认背景的*切换频率***，几乎每两个雨滴落下就会切换一次背景
   */
  raindropsTimeInterval: 3600;
  /**
   * ## 闲置波动
   *
   * 在光标交互不触发时，将触发模拟雨滴
   */
  idleFluctuations: true;
  /**
   *  ## 暗黑模式
   *
   *  在使用默认的主题设置时，当页面使用暗黑模式时出现了文本看不清的现象
   */
  darkMode: undefined;
  /**
   * ## 初始化时背景色
   *
   * 默认为透明，可传入一个色值，或双色值数组
   */
  loadingBackgroundColor: ['#00000000', '#00000000'];
}

/**
 * ## 绘制图像 （内部使用）
 */
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
  /** 当前是否是暗黑主题模式 */
  isDark: boolean;
};

/**
 * ## 纹理（内部使用）
 */
export type Textures = WebGLTexture[];

/**
 * ## 原使用的样式 (内部使用)
 */
export type OriginStyle = {
  /**  原始使用行内背景样式  */
  inlineBackground: string;
  /** 原始使用的行内背景色   */
  inlineBackgroundColor: string;
  /**  原始使用的背景图的样式  */
  inlineBackgroundImage: string;
  /**  元素的位置  */
  position: string;
  /**  元素的背景色  */
  backgroundColor: string;
  /**  元素的背景图  */
  backgroundImage: string;
  /**  元素的背景图的尺寸（多背景下）  */
  backgroundSize: string;
  /**  元素的背景图的位置  */
  backgroundPosition: string;
  /**  元素的背景图的重复方式  */
  backgroundRepeat: string;
  /**  元素的背景图的剪切方式  */
  backgroundClip: string;
  /**  元素的背景图的起点  */
  backgroundOrigin: string;
  /**  元素的背景图相对视口的滚动方式  */
  backgroundAttachment: string;
  /**  当前的宽  */
  width: number;
  /**  当前的高  */
  height: number;
};

/**
 * ## Ripple 状态管理（内部使用）
 *
 */
export interface RippleState extends RipplesUseOptions {
  /** 尺寸发生变化 (计数的方式触发更新) */
  sizeChange: number;
  /** 父级元素的样式发生变化（计数的方式触发更新） */
  styleChange: number;
}
