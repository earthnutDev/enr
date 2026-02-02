import { Ripples } from './class-ripple';
import type { RipplesOptions } from './types';

/**
 * ripple 的 html 导出，不依赖于 react
 * @param element
 * @param options
 */
export function useRipples(element: HTMLElement, options: RipplesOptions) {
  const canvas = document.createElement('canvas');
  element.appendChild(canvas);
  const ripple = new Ripples(canvas, options);

  return ripple;
}
