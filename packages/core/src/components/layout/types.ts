import type { CSSProperties } from 'react';
import type { PropsWithTagName } from '../type';

/**
 * 布局
 */
export type LayoutProps = PropsWithTagName<{
  /**  布局的  */
  /**
   * 布局的宽
   *
   *
   * 缺省值为 100vw
   */
  width?: string | number;
  /**
   * 布局可视界面的高
   *
   * 用于限制 side bar 的高度
   *
   * 缺省值为 100vh
   *
   * 为具体值。当为 100% 时 side bar 渲染不正确
   */
  height?: string | number;
  /**  其他的组件样式  */
  /**  样式  */
  style?: CSSProperties;
  /**  其他的组件样式  */
  theme?: LayoutTheme;
}>;

/**  侧边 sidebar 的参数  */
export type LayoutSideBarProps = PropsWithTagName<{
  classes?: string | string[];
  /**
   * 侧边栏的宽度
   *
   * 缺省值为 150
   */
  width?: number | string;
  /**
   * 是否居右
   *
   * 缺省值为 false
   */
  right?: boolean;
  /**
   * 是否占用所有空间
   *
   * 缺省值为 false
   */
  full?: boolean;
}>;

/**  Header 的 props   */
export type LayoutHeaderProps = PropsWithTagName<{
  /**
   * header 的高度
   *
   * 缺省值为 2.8rem
   */
  height?: number | string;
  /**
   * 是否取消悬挂粘连
   *
   * 缺省值为 false
   */
  noSticky?: boolean;
}>;

/**  脚组件的参数类型  */
export type LayoutFooterProps = PropsWithTagName<{
  classes?: string | string[];
  /**
   * footer 的高度
   *
   * 缺省值为 2rem
   */
  height?: number | string;
}>;

/**  定义布局主题类型  */
export interface LayoutTheme {
  /**  组件的宽  */
  layoutWith: string | number;
  /**  组件的高  */
  layoutHeight: string | number;
  /**  侧边的宽  */
  sideBarWidth: string | number;
  /**  头部的高  */
  headerHeight: string | number;
  /**  底部的高  */
  footerHeight: string | number;
}

/**  布局侧栏的状态 （内部使用项） */
export type EnLayoutSideState = 'side-right-full' | 'simple' | 'side-right' | 'side-full';

/**  可使用的样式类型 （内部使用） */
export type EnLayoutContentType =
  | 'simple'
  | 'only-footer'
  | 'only-header'
  | 'no-side'
  | 'simple-all'
  | 'side-right-all'
  | 'simple-no-footer'
  | 'side-right-no-footer'
  | 'side-full-all'
  | 'side-right-full-all'
  | 'side-full-no-footer'
  | 'side-right-full-no-footer'
  | 'simple-no-header'
  | 'side-right-no-header'
  | 'side-full-no-header'
  | 'side-right-full-no-header'
  | 'simple-only-side'
  | 'side-full-only-side'
  | 'side-right-only-side'
  | 'side-right-full-only-side';
