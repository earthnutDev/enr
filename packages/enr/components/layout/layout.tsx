import { InternalValueH as LayoutHeader } from './header';
import { InternalValueS as LayoutSideBar } from './sidebar';
import { InternalValueC as LayoutContent } from './content';
import { InternalValueF as LayoutFooter } from './footer';
import {
  EnLayoutContentType,
  EnLayoutSideState,
  LayoutFooterProps,
  LayoutHeaderProps,
  LayoutProps,
  LayoutSideBarProps,
  LayoutTheme,
} from './types';
import { xcn } from 'xcn';
import { isNumber, isString } from 'a-type-of-js';
import { EnLayoutContent, LayoutContentWrapper } from 'components/shared/EnLayoutContent';
import { getValue } from './get-value';
import { Children, cloneElement, forwardRef, isValidElement, ReactElement } from 'react';
import { isFragment } from './is-fragment';
import { dog } from 'packages/enr/dog';

/**  数值是否是需要转换的值  */
function isDecimal(value: string | number) {
  if (isNumber(value)) return value > 0 && value <= 1 ? `${value * 100}%` : value;
  return /^0\.\d+$/.test(value) ? `${parseFloat(value) * 100}%` : value;
}

/**
 *
 * ## layout
 *
 * 布局组件，用于构建页面布局。
 *
 * ***为了照顾在 next.js 中的服务端组件中使用，在拥有 `side bar` 时 `Layout` 的 `height` 为百分比时会触发 side bar 滚动***
 *
 * @param {string} className  布局的类名
 * @param {CSSProperties} style  布局的样式
 * @param {string | number} width  布局的宽
 * @param {string | number} height  布局的高
 * @example
 *
 * ```jsx
 *  <Layout>
 *    <LayoutHeader> 头部 </LayoutHeader>
 *    <LayoutSideBar> 侧边栏 </LayoutSideBar>
 *    <LayoutContent> 内容区 </LayoutContent>
 *    <LayoutFooter> 页脚 </LayoutFooter>
 *  </Layout>
 *
 * ```
 *
 * 该组件仅接受 `LayoutHeader`、`LayoutSideBar`、`LayoutContent` 和 `LayoutFooter` 作为（直接）子组件。
 *
 * 可任意搭配使用，但不推荐使用无 `LayoutContent` 使用。
 *
 * 目前已知当 `Layout` 嵌套 `Layout` 时，需要设定内部 `Layout` 的 `width` 和 `height`。
 *
 * ```jsx
 *  <Layout width="100%" height="100%">
 *    <Layout width="100%" height="100%">
 *      <LayoutSideBar width="150px"> 侧边栏 </LayoutSideBar>
 *      <LayoutContent> 内容区 </LayoutContent>
 *    </Layout>
 *    <LayoutFooter> 页脚 </LayoutFooter>
 *  </Layout>
 * ```
 *
 *
 */
const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, style, width = '100%', height = '100%', classes, ...props }, ref) => {
    dog.type = false;
    /**  子组件的个数  */
    const childCount = Children.count(children);
    /**  头部 header 是否粘连影响下的样式  */
    dog('子元素个数', childCount);
    /**  头部 header 组件  */
    let Header: ReactElement<LayoutHeaderProps> | undefined,
      /** 当前的样式   */
      sideState: EnLayoutSideState = 'simple' as EnLayoutSideState,
      headerNoSticky: boolean = false,
      /**  是否拥有头部（header）  */
      hasHeader: boolean = false,
      /**  侧边栏组件  */
      Sidebar: ReactElement | undefined,
      /**  是否拥有侧边（side bar）  */
      hasSideBar: boolean = false,
      /**  内容区，该内容区与 Content、SideBar 组成的 .content 不同  */
      Content: ReactElement | undefined,
      /**  是否拥有内容（Content）  */
      hasContent: boolean = false,
      /**  页脚区（Footer）  */
      Footer: ReactElement | undefined,
      /**  是否拥有页脚区  */
      hasFooter: boolean = false,
      /**  侧边的宽度，缺省值 `150（px）`  */
      sideWidth: string | number = 150,
      /**  头部的高度，缺省值 `2.8rem`  */
      headerHeight: string | number = '2.8rem',
      /**  页脚的高度，缺省值为 `2rem`  */
      footerHeight: string | number = '2rem';
    /**  头字符串样式类  */
    const $header: string = 'en-layout-header',
      /**  内容字符串样式类  */
      $content: string = 'en-layout-content',
      /**  主区字符串样式类  */
      $main: string = 'en-layout-main',
      /**  侧边字符串样式类  */
      $sidebar: string = 'en-layout-sidebar',
      /**  页脚字符串样式类  */
      $footer: string = 'en-layout-footer';
    /**  由 Fragment 包裹的子元素完成解包  */
    if (childCount === 1) {
      Children.forEach(children, child => {
        if (!isValidElement(child)) return;
        /**  是否仅有一个元素  */
        const onlyOneElement = Children.only(child);
        if (isFragment(onlyOneElement))
          // eslint-disable-next-line jsdoc/check-tag-names
          /**  @ts-expect-error: 已知晓其中厉害  */
          children = Children.toArray(child?.props?.children);
      });
    }

    // 转化可能是小数设置的宽度
    width = isDecimal(width);
    height = isDecimal(height);

    /// 校验所有的子元素，并修改特定的 props
    Children.forEach(children, child => {
      /// 检测 child 是否是有效的 React 元素（避免非元素节点）
      if (!isValidElement(child)) return;
      // 如果没有头且当前的元素是头
      if (!hasHeader && child.type === LayoutHeader) {
        /**  组件  */
        const element = child as ReactElement<LayoutHeaderProps>;
        /** 头部组件的参数们   */
        const headerProps = element.props;
        headerHeight = headerProps.height || headerHeight;
        headerNoSticky = headerProps.noSticky ?? false;
        Header = cloneElement(element, { className: xcn($header, element.props.className) });
        hasHeader = true;
      }
      // 侧边栏
      else if (!hasSideBar && child.type === LayoutSideBar) {
        /**  组件  */
        const element = child as ReactElement<LayoutSideBarProps>;
        const sideBarProps = element.props;
        sideWidth = sideBarProps.width || sideWidth;
        sideState =
          sideBarProps.right && sideBarProps.full
            ? 'side-right-full'
            : sideBarProps.right
              ? 'side-right'
              : sideBarProps.full
                ? 'side-full'
                : 'simple';
        Sidebar = cloneElement(element, {
          className: xcn($sidebar, element.props.className),
        });
        hasSideBar = true;
      }
      /// 内容区
      else if (!hasContent && child.type === LayoutContent) {
        /**  组件  */
        const element = child as ReactElement<LayoutHeaderProps>;
        Content = cloneElement(element, {
          className: xcn($main, element.props.className),
        });
        hasContent = true;
      }
      /// 内容区，渲染的一个被嵌套的 Layout
      else if (!hasContent && child.type === Layout) {
        /**  组件  */
        const element = child as ReactElement<LayoutSideBarProps>;
        Content = (
          <LayoutContentWrapper
            data-enr-ui="layout-content"
            className={xcn($main, 'en-layout-main')}
          >
            {element}
          </LayoutContentWrapper>
        );
        hasContent = true;
      } else if (!hasFooter && child.type === LayoutFooter) {
        /**  组件  */
        const element = child as ReactElement<LayoutFooterProps>;
        footerHeight = element.props.height || footerHeight;
        Footer = cloneElement(element, { className: xcn($footer, element.props.className) });
        hasFooter = true;
      }
    });
    /**  组件在子组件不同下的样式值  */
    let layoutType: EnLayoutContentType =
      hasHeader && hasSideBar && hasContent && hasFooter
        ? `${sideState}-all`
        : hasHeader && hasContent && hasSideBar
          ? `${sideState}-no-footer`
          : hasSideBar && hasContent && hasFooter
            ? `${sideState}-no-header`
            : hasHeader && hasContent && hasFooter
              ? 'no-side'
              : hasContent && hasFooter
                ? 'only-footer'
                : hasContent && hasHeader
                  ? 'only-header'
                  : hasContent && hasSideBar
                    ? `${sideState}-only-side`
                    : 'simple';

    /**  构建主题对象  */
    const theme: LayoutTheme = {
      layoutHeight: width,
      layoutWith: height,
      sideBarWidth: sideWidth,
      headerHeight,
      footerHeight,
      ...(props.theme || {}), // 保留外部传入的主题
    };

    if (layoutType === 'side-full-only-side') {
      layoutType = 'simple-only-side';
    } else if (layoutType === 'side-right-full-only-side') {
      layoutType = 'side-right-only-side';
    }

    /**  是否仅包含侧栏  */
    const shouldUseOnlySideLayout = /-only-side$/.test(layoutType);
    /**  确定布局结构  */
    const shouldUseSideFullLayout = /^side.*full/.test(layoutType);

    dog.type = true;

    return (
      <EnLayoutContent
        ref={ref}
        $headerNoSticky={headerNoSticky}
        $layoutType={layoutType}
        $header={$header}
        $sidebar={$sidebar}
        $main={$main}
        $content={$content}
        $footer={$footer}
        className={xcn(className, classes)}
        style={{
          // eslint-disable-next-line jsdoc/check-tag-names
          /**  @ts-expect-error: 自定义侧边栏的宽度  */
          '--layout-self-width': getValue(width),
          '--layout-self-height': getValue(height),
          '--layout-width': getValue(isString(width) && width.endsWith('%') ? '100%' : width),
          '--layout-height': getValue(isString(height) && height.endsWith('%') ? '100%' : height),
          '--layout-side-bar-width': getValue(sideWidth),
          '--layout-header-height': getValue(headerHeight),
          '--layout-footer-height': getValue(footerHeight),
          ...style,
        }}
        theme={theme}
        {...props}
        data-enr-ui="layout"
        data-enr-layout-type={layoutType}
      >
        {shouldUseOnlySideLayout ? (
          <>
            {Sidebar} {Content}
          </>
        ) : !shouldUseSideFullLayout ? (
          <>
            {Header}
            <div className={xcn($content)} data-enr-ui="layout-side-no-full-content">
              {Sidebar}
              {Content}
            </div>
            {Footer}
          </>
        ) : (
          // 特殊布局
          <>
            {Sidebar}
            <div className={xcn($content)} data-enr-ui="layout-side-full-container">
              {Header}
              {Content}
              {Footer}
            </div>
          </>
        )}
      </EnLayoutContent>
    );
  },
);

// / 渲染名 Component definition is missing display name
Layout.displayName = 'Layout';

export { Layout, LayoutHeader, LayoutSideBar, LayoutContent, LayoutFooter };
