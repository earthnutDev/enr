import { xcn as _xcn, EnClassNameItem, EnTypeofClassNameItem, EnXcn } from 'xcn';

export { useLazyRipples } from './customHooks/useRipples/use-lazy-ripple';

export { BackgroundRipple, LazyBackgroundRipple } from './components/ripples/';

export {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSideBar,
  EnLayout,
  EnLayoutContent,
  EnLayoutFooter,
  EnLayoutHeader,
  EnLayoutSideBar,
} from './components/layout';

export { useTimeId } from './customHooks/useTimeId';

export { useAnimationFrame } from './customHooks/useAnimationFrame';

export type {
  UseAnimationFrameResult,
  AnimationFrameOption,
} from './customHooks/useAnimationFrame';

export { useInputIsComposing } from './customHooks/useInputIsComposing';

export { useRipples } from './customHooks/useRipples';

export type {
  Ripples,
  BackgroundRipplesProps,
  RipplesOptions,
  RippleImgUrl,
} from './customHooks/useRipples';

export type {
  LayoutProps,
  LayoutSideBarProps,
  LayoutHeaderProps,
  LayoutFooterProps,
} from './components/layout';

// export { EnMarquee, Marquee } from './components/marquee/';

export { Image, Image as EnImage } from './components/image';

export type { EnImageProps } from './components/image';

/**  加强 xcn  */
function xcn<
  T extends (EnClassNameItem &
    (
      | 'en-center'
      | 'en-dust'
      | 'en-text-in-one-line'
      | 'en-text-in-one-line-hide'
      | 'en-text-in-two-line'
      | 'en-color-text'
      | 'en-bg-red'
      | 'en-float-left'
      | 'en-float'
      | 'en-float-right'
      | 'en-clear-float'
      | 'en-clear'
      | 'en-loading'
      | 'en-text-center'
      | 'en-text-right'
      | 'eb-text-small'
      | 'en-relative'
      | 'en-user-select-text'
      | 'en-cursor-pointer'
    ))[],
>(
  ...classNameList: T
): EnXcn<{
  [K in keyof T]: EnTypeofClassNameItem<T[K]>;
}> {
  return _xcn(...classNameList);
}

export { xcn };
