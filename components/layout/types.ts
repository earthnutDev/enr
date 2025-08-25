import { CSSProperties, HTMLAttributes } from 'react';

/**
 * 布局
 */
export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string | string[];
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
}

/**  侧边 sidebar 的参数  */
export interface LayoutSideBarProps extends HTMLAttributes<HTMLDivElement> {
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
}

/**  Header 的 props   */
export interface LayoutHeaderProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string | string[];
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
}

/**  脚组件的参数类型  */
export interface LayoutFooterProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string | string[];
  /**
   * footer 的高度
   *
   * 缺省值为 2rem
   */
  height?: number | string;
}

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

/**  可使用的样式类型  */
export type EnLayoutContentType =
  | 'simple'
  | 'only-footer'
  | 'only-header'
  | 'no-sidebar'
  | 'side-full'
  | 'side-right-full-all'
  | 'side-right-full-no-footer'
  | 'side-right-full-no-header'
  | 'side-right-full-only-side'
  | 'side-right-all'
  | 'side-right-no-footer'
  | 'side-right-no-header'
  | 'side-right-only-side'
  | 'side-full-all'
  | 'side-full-no-footer'
  | 'side-full-no-header'
  | 'side-full-only-side'
  | 'simple-all'
  | 'simple-no-footer'
  | 'simple-no-header'
  | 'simple-only-side';
