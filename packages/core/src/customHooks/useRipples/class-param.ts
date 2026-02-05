/**
 * @packageDocumentation
 * @module @enr/class-param
 * @file class-param.ts
 * @description 参数类
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-22 02:40
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-05 19:20
 */

import { isArray, isBoolean, isString, isUndefined } from 'a-type-of-js';
import { dog, dun } from 'zza/log';
import { defaultData } from './data-default';
import type { ImageCrossOrigin, RippleImgUrl, RipplesOptions } from './types';

/**
 * ## 传入参数
 *
 * 作为最低级的数据类，在其他类中提供当前可供用户操控的变量
 */
export class RippleParam {
  // ++++++++++++++++++++++ 》〉》〉》〉》 配置数据 ++++++++++++++++++++++

  /** 第一次加载 */
  firstRun: boolean = true;

  // 被遮盖的实际上一次执行的状态
  private _lastRunningState: boolean = false;

  /**  上一次执行渲染状态  */
  get lastRunningState(): boolean {
    return this._lastRunningState;
  }

  /** 动画执行快慢的节奏，值越大，执行越快。默认值 18 */
  readonly drawProgressStep = 18;
  /** 第一次加载时的步长 */
  readonly firstDrawProgressStep = 12;
  /**  canvas 的显隐  */
  visible: boolean = false;

  /** 初始化设定值，该值由用户设置，但不可修改 */
  readonly loadingBackgroundColor: [string, string];

  // ++++++++++++++++++++++ 配置数据 《〈《〈《〈《 ++++++++++++++++++++++

  // ++++++++++++++++++++++ 》〉》〉》〉》 用户控制变量 ++++++++++++++++++++++
  // 这些变量通过 Ripple 类的 set 方法设定

  /**  倍级触发光标事件（值）  */
  private _accelerating: number = defaultData.accelerating;
  /**  倍级触发光标事件  */
  set accelerating(value: number) {
    if (value > 100 || value < 2) return;
    this._accelerating = value;
  }
  /** 倍级触发光标事件  */
  get accelerating(): number {
    return this._accelerating;
  }

  /**  是否与鼠标互动（值）  */
  private _interactive: boolean = defaultData.interactive;
  /**  是否与鼠标互动  */
  set interactive(value: boolean) {
    if (!isBoolean(value)) return;
    this._interactive = value;
  }
  /**  是否与鼠标交互 */
  get interactive(): boolean {
    return this._interactive;
  }
  /**  分辨率（值）  */
  private _resolution: number = defaultData.resolution;
  /**
   * ##分辨率
   * 纹理的尺寸，该项目中该值为纹理的宽和高
   */
  set resolution(value: number) {
    if (value < 100 || value > 550) return;
    this._resolution = value;
  }
  /**
   * 纹理的尺寸，该项目中该值为纹理的宽和高
   */
  get resolution(): number {
    return this._resolution;
  }

  /**   扰动系数 （值） */
  private _perturbation: number = defaultData.perturbation;
  /**
   * ##扰动系数
   * 取值范围 `0.01 - 1`。 缺省 `0.01`
   */
  set perturbation(value: number) {
    if (value < 0.0001 || value > 1) return;
    this._perturbation = value;
  }
  /**  扰动系数 */
  get perturbation(): number {
    return this._perturbation;
  }

  /**  扩散半径（值）  */
  private _dropRadius: number = defaultData.dropRadius;

  /**
   * ##  扩散半径
   * 缺省为 `20`
   */
  set dropRadius(value: number) {
    if (!isFinite(value) || value < 10) return;
    this._dropRadius = value;
  }
  /**  扩散半径 */
  get dropRadius(): number {
    return this._dropRadius;
  }

  /**  传入的背景图片  */
  imgUrl: RippleImgUrl = defaultData.imgUrl;

  /**  闲置波动 （值） */
  _idleFluctuations: boolean = defaultData.idleFluctuations;
  /**  闲置波动  */
  set idleFluctuations(value: boolean) {
    if (!isBoolean(value)) return;
    this._idleFluctuations = value;
  }
  /**
   * ## 闲置波动
   */
  get idleFluctuations(): boolean {
    return this._idleFluctuations;
  }
  /**  雨滴落下的时间间隔（值）  */
  private _raindropsTimeInterval: number = defaultData.raindropsTimeInterval;

  /**  雨滴落下的时间间隔  */
  set raindropsTimeInterval(value: number) {
    if (value < 10 || value > 12000) return;
    this._raindropsTimeInterval = value;
  }
  /**
   * 雨滴落下的时间间隔
   */
  get raindropsTimeInterval(): number {
    return this._raindropsTimeInterval;
  }

  /**  crossOrigin  （是否跨域） */
  crossOrigin: ImageCrossOrigin = 'no-cors';

  /**  当前执行的状态  */
  private running: boolean = false;

  /**  当前执行的状态  */
  set playingState(value: boolean) {
    this.running = Boolean(value ?? true);
  }
  /**
   * 当前执行的状态
   */
  get playingState(): boolean {
    return this.running;
  }
  /**  当前时候为暗黑模式  */
  private _darkMode: boolean | undefined = undefined;

  /**  当前时候为暗黑模式  */
  get darkMode() {
    return this._darkMode;
  }
  /**  当前时候为暗黑模式  */
  set darkMode(value: boolean | undefined) {
    if (dun) {
      dog('设置参数的暗黑模式', value);
    }
    this._darkMode = isUndefined(value) ? undefined : Boolean(value);
  }

  // ++++++++++++++++++++++ 用户控制变量 《〈《〈《〈《 ++++++++++++++++++++++

  /**
   * 构建使用参数的数据
   * @param _options 初始化传入参数
   */
  constructor(_options?: RipplesOptions) {
    const options = {
      ...defaultData,
      ..._options,
    };
    this.perturbation = options.perturbation;
    this.resolution = options.resolution;
    this.raindropsTimeInterval = options.raindropsTimeInterval;
    this.accelerating = options.accelerating;
    this.interactive = options.interactive;
    this.dropRadius = options.dropRadius;
    this.imgUrl = options.imgUrl;
    this.idleFluctuations = options.idleFluctuations;
    this.running = Boolean(options.playingState ?? true);
    this.crossOrigin = options.crossOrigin;
    this.darkMode = options.darkMode;
    this.loadingBackgroundColor = this.getLoadingBg(options.loadingBackgroundColor);
  }

  /**
   * ## 切换最后一次执行的状态
   */
  toggleLastRunningState() {
    this._lastRunningState = !this._lastRunningState;
  }

  /**
   * ## 获取初始化背景值
   * @param _v 初始化的值
   */
  private getLoadingBg(_v?: string | [string] | [string, string]): [string, string] {
    if (isArray(_v)) {
      const len = _v.length;
      if (len === 1) {
        const color = _v[0];
        return [color, color];
      } else if (len === 2) {
        return [..._v];
      }
    } else if (isString(_v)) {
      return [_v, _v];
    }
    return ['#00000000', '#00000000'];
  }
}
