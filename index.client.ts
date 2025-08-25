export { useLazyRipples } from './customHooks/useRipples/use-lazy-ripple';

export { BackgroundRipple, LazyBackgroundRipple } from './components/ripples';

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

export { Image, Image as EnImage } from './components/image';

export type { EnImageProps } from './components/image';

export { useColorMode, ThemeColorModeProvider } from './components/ThemeContext';

export type {
  ColorMode,
  ThemeContextType,
  ThemeColorModeProviderProps,
} from './components/ThemeContext/types';

export { Switch, Switch as EnSwitch } from './components/switch';
