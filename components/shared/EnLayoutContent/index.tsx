'use client';
import { styled, css } from 'styled-components';
import { EnLayoutContentProps } from './types';

/**  创建带样式的组件  */
export const LayoutContentContainer = styled.main`
  grid-area: content;
  position: relative;
`;
/**  带样式的组件  */
export const LayoutFooterContent = styled.div`
  grid-area: footer;
  position: relative;
  height: var(--layout-footer-height);
  box-shadow: 0 -1px 13px 0px #0000001a;
  overflow: hidden;
`;

/**  带样式的头部  */
export const LayoutHeaderContainer = styled.nav`
  grid-area: header;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 10;
  height: var(--layout-header-height);
  box-shadow: 0 4px 13px -3px #0000001a;
  overflow: hidden;
`;

/**  带样式的组件  */
export const LayoutSideBarContainer = styled.aside`
  position: sticky;
  left: 0;
  z-index: 8;
  grid-area: side;
  overflow-x: hidden;
  overflow-y: auto;
`;

/**  内容区域容器  */
export const LayoutContentWrapper = styled.div`
  position: relative;
  grid-area: content;
  overflow: auto;
`;

/**  元始的外壳  */
export const EnLayoutContent = styled.div<EnLayoutContentProps>`
  position: relative;
  top: 0px;
  height: var(--layout-self-height);
  width: var(--layout-self-width);
  overflow-x: hidden;
  overflow-y: auto;

  ${({ $headerNoSticky, $header, $layoutType, $content, $sidebar }) =>
    $headerNoSticky &&
    css`
      // 头部不粘连样式，头部区域设置
      & > .${$header} {
        position: relative;
        z-index: 2;
      }

      ${($layoutType === 'simple-all' || $layoutType === 'side-right-all') &&
      // 头部不粘连样式，内容区设置
      css`
        & > .${$content} > .${$sidebar} {
          top: 0;
          min-height: calc(
            var(--layout-height) - var (--layout-footer-height) - var(--layout-header-height)
          );
          max-height: var(--layout-height);
        }
      `}

      ${($layoutType === 'simple-no-footer' || $layoutType === 'side-right-no-footer') &&
      css`
        & > .${$sidebar} {
          top: 0;
          min-height: calc(var(--layout-height) - var(--layout-footer-height));
          max-height: var(--layout-height);
        }
      `}
    `}

  ${({ $layoutType, $content }) =>
    $layoutType === 'no-sidebar' &&
    css`
      & > .${$content} {
        min-height: calc(
          var(--layout-height) - var(--layout-header-height) - var(--layout-footer-height)
        );
      }
    `}

  // 侧边栏全屏样式
  ${({ $layoutType, $sidebar }) =>
    $layoutType === 'side-full' &&
    css`
      & > .${$sidebar} {
        top: 0;
        height: var(--layout-height);
      }
    `}

  // ------------------------------
  // --- 标准模式（全）与侧边栏右置（全）共用样式 ---
  // 标准模式（全）与侧边栏右置（全）
  ${({ $layoutType, $content, $sidebar }) =>
    ['simple-all', 'side-right-all'].includes($layoutType) &&
    css`
      // 子元素
      & > .${$content} {
        display: grid;
        grid-template-rows:
          calc(var(--layout-height) - var(--layout-header-height) - var(--layout-footer-height))
          auto;
        min-height: calc(
          var(--layout-height) - var(--layout-header-height) - var(--layout-footer-height)
        );

        // side bar 块保持粘连，且在 content height 不足时支撑页面
        & > .${$sidebar} {
          top: var(--layout-header-height);
          min-height: calc(
            var(--layout-height) - var(--layout-header-height) - var(--layout-footer-height)
          );
          max-height: calc(var(--layout-height) - var(--layout-header-height));
        }
      }
    `}

  // 标准模式（全） 侧边栏与内容区设置
  ${({ $layoutType, $content }) =>
    ['simple-all', 'simple-no-header'].includes($layoutType) &&
    css`
      & > .${$content} {
        grid-template-columns: var(--layout-side-bar-width) auto;
        grid-template-areas:
          'side content'
          '. content';
      }
    `}
  // 侧边栏（全） 侧边栏与内容区设置
  ${({ $layoutType, $content }) =>
    ['side-right-all', 'side-right-no-header'].includes($layoutType) &&
    css`
      & > .${$content} {
        grid-template-columns: auto var(--layout-side-bar-width);
        grid-template-rows: 100% max-content;
        grid-template-areas:
          'content side'
          'content .';
      }
    `}

   // 侧边栏 (全) 左侧全屏
   // side bar 居左全尺寸
   // side bar 值由 en-layout-side-full 控制
  ${({ $layoutType }) =>
    ['side-full-all', 'side-right-full-all'].includes($layoutType) &&
    css`
      display: grid;
      grid-template-rows: var(--layout-header-height) auto var(--layout-footer-height);
      gap: 0px;
    `}
  
  // 标准的 side bar 居左全尺寸
  ${({ $layoutType }) =>
    $layoutType === 'side-full-all' &&
    css`
      grid-template-columns: var(--layout-side-bar-width) auto;
      grid-template-rows: 100% max-content;
      grid-template-areas:
        'side header'
        'side content'
        'side footer';
    `}

  // side bar 居右全尺寸
  ${({ $layoutType }) =>
    $layoutType === 'side-right-full-all' &&
    css`
      grid-template-columns: auto var(--layout-side-bar-width);
      grid-template-rows: 100% max-content;
      grid-template-areas:
        'header side'
        'content side'
        'footer side';
    `}
  
  // ------------------------------
  // --- 标准模式（无 header）与侧边栏在右侧的无头模式共用样式 ---
  // 标准的无头模式样式、侧边栏在右侧的无头模式样式
  ${({ $layoutType, $content, $sidebar }) =>
    ['simple-no-header', 'side-right-no-header'].includes($layoutType) &&
    css`
      & > .${$content} {
        display: grid;
        grid-template-rows: auto;
        // side bar 块的样式
        & > .${$sidebar} {
          top: 0;
          min-height: calc(var(--layout-height) - var(--layout-footer-height));
          max-height: var(--layout-height);
        }
      }
    `}
  
  // 侧边栏（无 header ）全屏
  // side bar 居左全尺寸
  // side bar 值由 en-layout-side-full 控制
  ${({ $layoutType }) =>
    ['side-full-no-header', 'side-right-full-no-header'].includes($layoutType) &&
    css`
      display: grid;
      grid-template-rows: auto var(--layout-footer-height);
      gap: 0px;
    `}

  // 标准的 side bar 居左全尺寸
  ${({ $layoutType }) =>
    $layoutType === 'side-full-no-header' &&
    css`
      grid-template-columns: var(--layout-side-bar-width) auto;
      grid-template-rows: 100% max-content;
      grid-template-areas:
        'side content'
        'side footer';
    `}

  // side bar 居右全尺寸
  ${({ $layoutType }) =>
    $layoutType === 'side-right-full-no-header' &&
    css`
      grid-template-columns: auto var(--layout-side-bar-width);
      grid-template-rows: 100% max-content;
      grid-template-areas:
        'content side'
        'footer side';
    `}
  
  // ------------------------------
  // 标准模式（无 footer）与侧边栏右置（无 footer）共用样式
  // 没有 footer
  ${({ $layoutType, $sidebar }) =>
    ['simple-no-footer', 'side-right-no-footer'].includes($layoutType) &&
    css`
      display: grid;
      grid-template-rows: var(--layout-header-height) auto;
      min-height: calc(var(--layout-height) - var(--layout-header-height));
      gap: 0px;
      // side bar 块保持粘连，且在 content height 不足时支撑页面
      & > .${$sidebar} {
        top: var(--layout-header-height);
        height: calc(var(--layout-height) - var(--layout-header-height));
      }
    `}
  

  // 标准模式（无 footer） 侧边栏与内容区设置
  ${({ $layoutType }) =>
    $layoutType === 'simple-no-footer' &&
    css`
      grid-template-columns: var(--layout-side-bar-width) auto;
      grid-template-rows: 100% max-content;
      grid-template-areas:
        'header header'
        'side content'
        '. content';
    `}


// 侧边栏在右侧的无 footer 模式样式
  ${({ $layoutType }) =>
    $layoutType === 'side-right-no-footer' &&
    css`
      grid-template-columns: auto var(--layout-side-bar-width);
      grid-template-rows: 100% max-content;
      grid-template-areas:
        'header header'
        'content side'
        'content .';
    `}

// 侧边栏 (全) 左侧全屏
// side bar 居左全尺寸
// side bar 值由 en-layout-side-full 控制
${({ $layoutType, $main }) =>
    ['side-full-no-footer', 'side-right-full-no-footer'].includes($layoutType) &&
    css`
      display: grid;
      grid-template-rows: var(--layout-header-height) auto;
      gap: 0px;

      // content 块
      & > .${$main} {
        min-height: calc(var(--layout-height) - var (--layout-header-height));
      }
    `}

// 标准的 side bar 居左全尺寸
  ${({ $layoutType }) =>
    $layoutType === 'side-full-no-footer' &&
    css`
      grid-template-columns: var(--layout-side-bar-width) auto;
      grid-template-rows: 100% max-content;
      grid-template-areas:
        'side header'
        'side content';
    `}


  // side bar 居右全尺寸
  ${({ $layoutType }) =>
    $layoutType === 'side-right-full-no-footer' &&
    css`
      grid-template-columns: auto var(--layout-side-bar-width);
      grid-template-rows: 100% max-content;
      grid-template-areas:
        'header side'
        'content side';
    `}
  
  // ------------------------------
  // --- 分割线  --- 
  // 下面是仅头部、底部和侧边栏布局
  // 仅底部布局
  ${({ $layoutType }) =>
    $layoutType === 'only-footer' &&
    css`
      display: grid;
      grid-template-rows: auto var(--layout-footer-height);
      grid-template-columns: 1fr;
      gap: 0px;
      grid-template-areas: 'content' 'footer';
    `}

  // 仅头部布局
  ${({ $layoutType }) =>
    $layoutType === 'only-header' &&
    css`
      display: grid;
      grid-template-rows: var(--layout-header-height) auto;
      grid-template-columns: 1fr;
      gap: 0px;
      grid-template-areas: 'header' 'content';
    `}
  
  // 仅侧边布局
// 标准的无头模式样式、侧边栏在右侧的无头模式样式
// side bar 值由 en-layout-side-full 控制
  ${({ $layoutType }) =>
    [
      'simple-only-side',
      'side-right-only-side',
      'side-full-only-side',
      'side-right-full-only-side',
    ].includes($layoutType) &&
    css`
      display: grid;
      // 纵向空间占比设置
      grid-template-rows: 100%;
      // 横向空间占比设置
      grid-template-columns: var(--layout-side-bar-width) auto;
      grid-template-rows: 100% max-content;
      gap: 0px;
      grid-template-areas:
        'side content'
        '. content';
    `}
  
  // 右侧侧边布局
  ${({ $layoutType }) =>
    ($layoutType === 'side-right-full-only-side' || $layoutType === 'side-right-only-side') &&
    css`
      grid-template-areas:
        'content side'
        'content .';
      grid-template-columns: auto var(--layout-side-bar-width);
      grid-template-rows: 100% max-content;
    `}
`;
