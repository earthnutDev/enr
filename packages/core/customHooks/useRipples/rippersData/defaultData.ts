import { RipplesDefaultData } from '../types';

/**
 * 默认值
 */
export const defaultData: RipplesDefaultData = {
  imgUrl: null,
  resolution: 360,
  dropRadius: 12,
  perturbance: 0.01,
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
