import * as React from 'react';
import { InternalValueH as LayoutHeader } from './header';
import { InternalValueS as LayoutSideBar } from './sideBar';
import { InternalValueC as LayoutContent } from './content';
import { InternalValueF as LayoutFooter } from './footer';
import {
  EnLayoutContentType,
  LayoutFooterProps,
  LayoutHeaderProps,
  LayoutProps,
  LayoutSideBarProps,
  LayoutTheme,
} from './types';
import { xcn } from 'xcn';
import { isTrue } from 'a-type-of-js';
import { EnLayoutContent, LayoutContentWrapper } from 'components/shared/EnLayoutContent';
import { getValue } from './get-value';

/**
 *
 * ## layout
 *
 * 布局组件，用于构建页面布局。
 *
 * ***为了照顾在 next.js 中的服务端组件中使用，在拥有 `side bar` 时 `Layout` 的 `height` 为百分比时会触发 side bar 滚动***
 *
 * @param {string} className  布局的类名
 * @param {React.CSSProperties} style  布局的样式
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
const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, style, width = '100vw', height = '100vh', classes, ...props }, ref) => {
    /**  子组件的个数  */
    // const childCount = React.Children.count(children);
    /**  头部 header 是否粘连影响下的样式  */
    // console.log('子元素个数', childCount);
    /**  头部 header 组件  */
    let Header: React.ReactElement<LayoutHeaderProps> | undefined,
      /** 当前的样式   */
      layout: string = 'simple',
      headerNoSticky: boolean = false,
      /**  是否拥有头部（header）  */
      hasHeader: boolean = false,
      /**  侧边栏组件  */
      SideBar: React.ReactElement | undefined,
      /**  是否拥有侧边（side bar）  */
      hasSideBar: boolean = false,
      /**  内容区，该内容区与 Content、SideBar 组成的 .content 不同  */
      Content: React.ReactElement | undefined,
      /**  是否拥有内容（Content）  */
      hasContent: boolean = false,
      /**  页脚区（Footer）  */
      Footer: React.ReactElement | undefined,
      /**  是否拥有页脚区  */
      hasFooter: boolean = false,
      /**  侧边的宽度，缺省值 `150（px）`  */
      sideWidth: string | number = 150,
      /**  头部的高度，缺省值 `2.8rem`  */
      headerHeight: string | number = '2.8rem',
      /**  页脚的高度，缺省值为 `2rem`  */
      footerHeight: string | number = '2rem',
      /**  侧边是否占据所有尺寸（发生于 side bar 的 full 为 true 和仅有 side bar 时）   */
      sideFull: boolean = false;
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

    /// 校验所有的子元素，并修改特定的 props
    React.Children.forEach(children, child => {
      /// 检测 child 是否是有效的 React 元素（避免非元素节点）
      if (!React.isValidElement(child)) return;
      // 如果没有头且当前的元素是头
      if (!hasHeader && child.type === LayoutHeader) {
        /**  组件  */
        const element = child as React.ReactElement<LayoutHeaderProps>;
        /** 头部组件的参数们   */
        const headerProps = element.props;
        headerHeight = headerProps.height || headerHeight;
        headerNoSticky = headerProps.noSticky ?? false;
        Header = React.cloneElement(element, { className: xcn($header, element.props.className) });
        hasHeader = true;
      }
      // 侧边栏
      else if (!hasSideBar && child.type === LayoutSideBar) {
        /**  组件  */
        const element = child as React.ReactElement<LayoutSideBarProps>;
        const sideBarProps = element.props;
        sideWidth = sideBarProps.width || sideWidth;
        layout =
          sideBarProps.right && sideBarProps.full
            ? 'side-right-full'
            : sideBarProps.right
              ? 'side-right'
              : sideBarProps.full
                ? 'side-full'
                : 'simple';
        sideFull = isTrue(sideBarProps.full);
        SideBar = React.cloneElement(element, {
          className: xcn($sidebar, element.props.className),
        });
        hasSideBar = true;
      }
      /// 内容区
      else if (!hasContent && child.type === LayoutContent) {
        /**  组件  */
        const element = child as React.ReactElement<LayoutHeaderProps>;
        Content = React.cloneElement(element, {
          className: xcn($main, element.props.className),
        });
        hasContent = true;
      }
      /// 内容区，渲染的一个被嵌套的 Layout
      else if (!hasContent && child.type === Layout) {
        /**  组件  */
        const element = child as React.ReactElement<LayoutSideBarProps>;
        Content = (
          <LayoutContentWrapper
            data-earthnut-ui="layout-content"
            className={xcn($main, 'en-layout-main')}
          >
            {element}
          </LayoutContentWrapper>
        );
        hasContent = true;
      } else if (!hasFooter && child.type === LayoutFooter) {
        /**  组件  */
        const element = child as React.ReactElement<LayoutFooterProps>;
        footerHeight = element.props.height || footerHeight;
        Footer = React.cloneElement(element, { className: xcn($footer, element.props.className) });
        hasFooter = true;
      }
    });
    /**  组件在子组件不同下的样式值  */
    const layoutType: EnLayoutContentType =
      (hasHeader && hasSideBar && hasContent && hasFooter && `${layout}-all`) ||
      (hasHeader && hasContent && hasSideBar && `${layout}-no-footer`) ||
      (hasSideBar && hasContent && hasFooter && `${layout}-no-header`) ||
      (hasHeader && hasContent && hasFooter && 'no-sidebar') ||
      (hasContent && hasFooter && 'only-footer') ||
      (hasContent && hasHeader && 'only-header') ||
      (hasContent && hasSideBar && (sideFull = true) && `${layout}-only-side`) ||
      'simple';

    /**  构建主题对象  */
    const theme: LayoutTheme = {
      layoutHeight: width,
      layoutWith: height,
      sideBarWidth: sideWidth,
      headerHeight,
      footerHeight,
      ...(props.theme || {}), // 保留外部传入的主题
    };

    /**  确定布局结构  */
    const shouldUseSpecialLayout = /side.*full/.test(layout);
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
        className={xcn(
          sideFull && 'en-layout-side-full',
          `en-layout-${layoutType}`,
          className,
          classes,
        )}
        style={{
          // eslint-disable-next-line jsdoc/check-tag-names
          /**  @ts-expect-error: 自定义侧边栏的宽度  */
          '--layout-width': getValue(width),
          '--layout-height': getValue(height),
          '--layout-side-bar-width': getValue(sideWidth),
          '--layout-header-height': getValue(headerHeight),
          '--layout-footer-height': getValue(footerHeight),
          ...style,
        }}
        theme={theme}
        {...props}
        data-earthnut-ui="layout"
      >
        {!shouldUseSpecialLayout ? (
          <>
            {Header}
            {hasFooter ? (
              <div className={xcn($content)} data-earthnut-ui="layout-with-foot-content">
                {SideBar}
                {Content}
              </div>
            ) : (
              <>
                {SideBar}
                {Content}
              </>
            )}
            {Footer}
          </>
        ) : (
          // 特殊布局
          <>
            {SideBar}
            {Header}
            {Content}
            {Footer}
          </>
        )}
      </EnLayoutContent>
    );
  },
);

// / 渲染名 Component definition is missing display name
Layout.displayName = 'Layout';

export { Layout, LayoutHeader, LayoutSideBar, LayoutContent, LayoutFooter };
