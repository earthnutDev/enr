import { RipplesOptions } from '../../customHooks/useRipples';

export type RippleEle = {
  /**  切换当前的状态  */
  toggleState(): void;
  /**  获取当前的状态  */
  state: boolean;
  /**  暂停当前涟漪的渲染  */
  pause(): void;
  /**  设置属性 */
  set(options?: RipplesOptions): void;
};
