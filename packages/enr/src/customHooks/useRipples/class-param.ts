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
 * @lastModified 2026-02-01 05:38
 */

import { isBoolean, isUndefined } from 'a-type-of-js';
import { dog, dun } from 'zza/log';
import { defaultData } from './data-default';
import type { ImageCrossOrigin, RippleImgUrl, RipplesOptions } from './types';

/**
 * ## 传入参数
 *
 * 作为最低级的数据类，在其他类中提供当前可供用户操控的变量
 */
export class RippleParam {
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
   * 闲置波动
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
  /**  canvas 的显隐  */
  visible: boolean = false;
  /**  当前执行的状态  */
  running: boolean = false;

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

  /**  上一次执行渲染状态  */
  lastRunningState: boolean = false;
  /** 第一次加载 */
  firstRun: boolean = true;

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
  }
}
