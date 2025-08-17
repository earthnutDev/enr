import { _en } from './customHooks/use-xcn';
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

export { _en };
