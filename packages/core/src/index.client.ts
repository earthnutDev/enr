export { useLazyRipples } from './customHooks/useRipples/use-lazy-ripple';

export { useTimeId } from './customHooks/useTimeId';

export { useAnimationFrame } from './customHooks/useAnimationFrame';

export type {
  UseAnimationFrameResult,
  AnimationFrameOption,
  UseAnimationFrame,
} from './customHooks/useAnimationFrame';

export { useInputIsComposing } from './customHooks/useInputIsComposing';

export { useRipples } from './customHooks/useRipples';

export type { Ripples, RipplesOptions, RippleImgUrl } from './customHooks/useRipples';

export type {
  BaseElementAttributesMap,
  ElementTypeFromTagName,
  TagNameFromElementType,
  ElementTypeToProps,
  MayWithRef,
  HTMLTagName,
  WithRefForElement,
  WithRefForElement as EnWithRefForElement,
  TagNameToProps,
  WithRefForTagName,
  WithRefForTagName as WithRef,
  SimpleObject,
  PropsWithElement,
  JSXOtherAttribute,
  JSXComponentForElement,
  PropsWithTagNameCustomRef,
  JSXComponentForElement as EnJSXComponentForElement,
  JSXComponentNoPropsForElement,
  PropsWithTagName,
  JSXComponent,
  JSXComponentNoProps,
  PolymorphicComponent,
  PolymorphicComponent as EnPolymorphicComponent,
} from './components/type';

export type {
  LayoutProps,
  LayoutSideBarProps,
  LayoutHeaderProps,
  LayoutFooterProps,
} from './components/layout';

export { Image, Image as EnImage } from './components/image';

export { useColorMode, ThemeColorModeProvider } from './components/ThemeContext';

export type {
  ColorMode,
  ThemeContextType,
  ThemeColorModeProviderProps,
} from './components/ThemeContext/types';

export { Switch, Switch as EnSwitch } from './components/switch';

export { Details, Details as EnDetails } from './components/Details';

export type { DetailsProps } from './components/Details';

export { BackgroundRipple, LazyBackgroundRipple } from './components/ripples';

export type { BackgroundRipplesProps, RippleEle } from './components/ripples';
