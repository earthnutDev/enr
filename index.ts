export {
  useLazyRipples,
  BackgroundRipple,
  LazyBackgroundRipple,
  useTimeId,
  useInputIsComposing,
  useRipples,
  Image,
  EnImage,
  useColorMode,
  ThemeColorModeProvider,
  Switch,
  EnSwitch,
  Details,
  EnDetails,
} from './index.client';

// >>>
// 移除标志开始

export type {
  UseAnimationFrameResult,
  AnimationFrameOption,
  Ripples,
  BackgroundRipplesProps,
  RipplesOptions,
  RippleImgUrl,
  LayoutProps,
  LayoutSideBarProps,
  LayoutHeaderProps,
  LayoutFooterProps,
  EnImageProps,
  ColorMode,
  ThemeContextType,
  ThemeColorModeProviderProps,
} from './index.client';

// 移除标志结束
// <<<

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
  _en,
  en,
  enc,
} from './index.server';
