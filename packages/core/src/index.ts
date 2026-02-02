/**
 * @packageDocumentation
 * @module @enr/index
 * @file index.ts
 * @description enr
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2024-12-12 11:21
 * @version 2.0.0-alpha.0
 * @lastModified 2026-01-25 19:12
 */

export {
  useLazyRipples,
  BackgroundRipple,
  LazyBackgroundRipple,
  useTimeId,
  useInputIsComposing,
  useAnimationFrame,
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
  UseAnimationFrame,
  AnimationFrameOption,
  Ripples,
  DetailsProps,
  BackgroundRipplesProps,
  RipplesOptions,
  RippleImgUrl,
  RippleEle,
  LayoutProps,
  LayoutSideBarProps,
  LayoutHeaderProps,
  LayoutFooterProps,
  ColorMode,
  ThemeContextType,
  ThemeColorModeProviderProps,
  BaseElementAttributesMap,
  ElementTypeFromTagName,
  TagNameFromElementType,
  ElementTypeToProps,
  MayWithRef,
  HTMLTagName,
  JSXOtherAttribute,
  WithRefForElement,
  EnWithRefForElement,
  TagNameToProps,
  WithRefForTagName,
  WithRef,
  SimpleObject,
  PropsWithElement,
  PropsWithTagNameCustomRef,
  JSXComponentForElement,
  EnJSXComponentForElement,
  JSXComponentNoPropsForElement,
  PropsWithTagName,
  JSXComponent,
  JSXComponentNoProps,
  PolymorphicComponent,
  EnPolymorphicComponent,
} from './index.client';

export type { EnClassName } from './index.server';

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
