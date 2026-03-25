/**
 * @packageDocumentation
 * @module @enr/data-default
 * @file data-default.ts
 * @description 默认属性值
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-22 11:55
 * @version 2.0.0-alpha.0
 * @lastModified 2026-03-25 20:26
 */

import type { RipplesDefaultData } from './types';

/**  TODO ： 对象改函数式编程在下一个阶段进行处理 */

/** 默认的图像 URL */
export const defaultImgUrl = null;
/** 默认的波速值 */
export const defaultResolution = 360;
/** 默认的波动强度 */
export const defaultDropRadius = 12;
/** 默认的扰动系数 */
export const defaultPerturbation = 0.01;

/**
 * ## 默认值
 */
export const defaultData: RipplesDefaultData = {
  imgUrl: null,
  resolution: 360,
  dropRadius: 12,
  perturbation: 0.01,
  interactive: true,
  crossOrigin: 'no-cors',
  playingState: true,
  accelerating: 1,
  raindropsTimeInterval: 3600,
  idleFluctuations: true,
  darkMode: undefined,
  loadingBackgroundColor: ['#00000000', '#00000000'],
};

/**  冷冻执行  */
Object.freeze(defaultData);

export const defaultDataKey = Object.keys(defaultData) as (keyof RipplesDefaultData)[];
