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
 * @lastModified 2026-01-22 23:57
 */

import type { RipplesDefaultData } from './types';

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
} as const;

/**  冷冻执行  */
Object.freeze(defaultData);
