import { Ripples } from './ripplesClass';
import { RipplesOptions } from './types';

/**
 * ripple 的 html 导出，不依赖于 react
 */
export function useRipples(element: HTMLElement, options: RipplesOptions) {
  const canvas = document.createElement('canvas');
  element.appendChild(canvas);
  const ripple = new Ripples(canvas, options);

  return ripple;
}
