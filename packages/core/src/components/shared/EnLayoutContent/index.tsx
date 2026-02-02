'use client';
import { styled, css } from 'styled-components';
import type { JSXComponent } from '../../type';
import type { EnLayoutContentProps } from './types';

/**  创建带样式的组件  */
export const LayoutContentContainer: JSXComponent = styled.main`
  grid-area: content;
  position: relative;
  scroll-behavior: smooth;
`;
/**  带样式的组件  */
export const LayoutFooterContent: JSXComponent = styled.footer`
  grid-area: footer;
  position: relative;
  height: var(--layout-footer-height);
  box-shadow: 0 -1px 13px 0px #0000001a;
  overflow: hidden;
`;

/**  带样式的头部  */
export const LayoutHeaderContainer: JSXComponent = styled.nav`
  grid-area: header;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 10;
  height: var(--layout-header-height);
  box-shadow: 0 4px 13px -3px #0000001a;
  overflow: hidden;
  scroll-behavior: smooth;
`;

/**  带样式的组件  */
export const LayoutSideBarContainer: JSXComponent = styled.aside`
  position: sticky;
  left: 0;
  z-index: 8;
  grid-area: side;
  overflow-x: hidden;
  overflow-y: auto;
`;

/**  内容区域容器  */
export const LayoutContentWrapper: JSXComponent = styled.div`
  position: relative;
  grid-area: content;
  overflow: auto;
`;

/**
 * ## 元始的外壳
 * @param props 根
 * @param props.$headerNoSticky 头部是否黏连
 * @param props.$header 是否有头部
 * @param props.$layoutType 布局类型
 * @param props.$content 内容区
 * @param props.$sidebar 侧边栏
 */
export const EnLayoutContent: JSXComponent<EnLayoutContentProps> = styled.div<EnLayoutContentProps>`
  position: relative;
  top: 0px;
  height: var(--layout-self-height);
  width: var(--layout-self-width);
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;

  /**************************************
   *
   * 标准模式（全）与侧边栏右置（全）
   * 
   * 该布局对应了侧栏不为全高且非除主要区域外仅一个区域的项
   * 
   *
   **************************************/
  ${({ $layoutType, $content, $sidebar }) =>
    [
      'simple-all',
      'simple-no-footer',
      'side-right-no-footer',
      'side-right-all',
      'simple-no-header',
      'side-right-no-header',
    ].includes($layoutType) &&
    css`
      // 子元素
      & > .${$content} {
        display: grid;
        scroll-behavior: smooth;

        /* 全元素，所有内容需要减去页头、页脚的高 */
        ${['simple-all', 'side-right-all'].includes($layoutType) &&
        css`
          grid-template-rows:
            max(
              100%,
              calc(var(--layout-height) - var(--layout-header-height) - var(--layout-footer-height))
            )
            auto;
          min-height: calc(
            var(--layout-height) - var(--layout-header-height) - var(--layout-footer-height)
          );
        `}
        /* 没有页脚，只需减去页头的高 */
        ${['simple-no-footer', 'side-right-no-footer'].includes($layoutType) &&
        css`
          grid-template-rows:
            max(100%, calc(var(--layout-height) - var(--layout-header-height)))
            auto;
          min-height: calc(var(--layout-height) - var(--layout-header-height));
        `}
        /* 没有页头，只需减去页脚的高即可 */
       ${['simple-no-header', 'side-right-no-header'].includes($layoutType) &&
        css`
          grid-template-rows:
            max(100%, calc(var(--layout-height) - var(--layout-footer-height)))
            auto;
        `}
        /* 标准的左侧栏结构左右布局 */
        ${['simple-all', 'simple-no-header', 'simple-no-footer'].includes($layoutType) &&
        css`
          grid-template-columns: var(--layout-side-bar-width) auto;
          grid-template-areas:
            'side content'
            '. content';
        `}

        /*  右侧栏左右布局 */
        ${['side-right-all', 'side-right-no-header', 'side-right-no-footer'].includes(
          $layoutType,
        ) &&
        css`
          grid-template-columns: auto var(--layout-side-bar-width);
          grid-template-areas:
            'content side'
            'content .';
        `}
        // side bar 块保持粘连，且在 content height 不足时支撑页面
        & > .${$sidebar} {
          top: var(--layout-header-height);
          ${['simple-all', 'side-right-all'].includes($layoutType) &&
          css`
            min-height: calc(
              var(--layout-height) - var(--layout-header-height) - var(--layout-footer-height)
            );
            max-height: calc(var(--layout-height) - var(--layout-header-height));
          `}
          ${['simple-no-footer', 'side-right-no-footer'].includes($layoutType) &&
          css`
            min-height: calc(var(--layout-height) - var(--layout-header-height));
            max-height: calc(var(--layout-height) - var(--layout-header-height));
          `}
          ${['simple-no-header', 'side-right-no-header'].includes($layoutType) &&
          css`
            top: 0;
            min-height: calc(var(--layout-height) - var(--layout-footer-height));
            max-height: var(--layout-height);
          `}
        }
      }
    `}

  /**************************************
    *
    * 侧边全尺寸
    *
    **************************************/
  ${({ $layoutType, $content, $sidebar }) =>
    [
      'side-full-all',
      'side-right-full-all',
      'side-full-no-footer',
      'side-right-full-no-footer',
      'side-full-no-header',
      'side-right-full-no-header',
    ].includes($layoutType) &&
    css`
      display: grid;
      grid-template-rows: 100%;
      gap: 0px;

      ${['side-full-no-footer', 'side-full-all', 'side-full-no-header'].includes($layoutType) &&
      css`
        grid-template-columns: var(--layout-side-bar-width) auto;
        grid-template-areas: 'side container';
      `}

      ${['side-right-full-no-footer', 'side-right-full-all', 'side-right-full-no-header'].includes(
        $layoutType,
      ) &&
      css`
        grid-template-columns: auto var(--layout-side-bar-width);
        grid-template-areas: 'container side';
      `}

      & > .${$sidebar} {
        height: 100%;
      }
      & > .${$content} {
        height: 100%;
        overflow: auto;
        grid-area: container;
        display: grid;
        scroll-behavior: smooth;

        ${['side-full-all', 'side-right-full-all'].includes($layoutType) &&
        css`
          grid-template-rows: var(--layout-header-height) auto var(--layout-footer-height);
          grid-template-areas:
            'header'
            'content'
            'footer';
        `}
        ${['side-full-no-footer', 'side-right-full-no-footer'].includes($layoutType) &&
        css`
          grid-template-rows: var(--layout-header-height) auto;
          grid-template-areas:
            'header'
            'content';
        `}
        ${['side-full-no-header', 'side-right-full-no-header'].includes($layoutType) &&
        css`
          grid-template-rows: auto var(--layout-footer-height);
          grid-template-areas:
            'content'
            'footer';
        `}
      }
    `}

  /**************************************
   *
   * 不粘连属于特殊配置
   *
   * 必须在最后才能保证覆盖其他非特殊设置
   *
   **************************************/
  ${({ $headerNoSticky, $header, $layoutType, $content, $sidebar }) =>
    $headerNoSticky &&
    css`
      // 头部不粘连样式，头部区域设置
      & > .${$header}, & > .${$content} > .${$header} {
        position: relative;
        z-index: 2;
      }

      ${['simple-all', 'side-right-all', 'simple-no-footer', 'side-right-no-footer'].includes(
        $layoutType,
      ) &&
      // 头部不粘连样式，内容区设置
      css`
        & > .${$content} > .${$sidebar} {
          top: 0;
          // 没有脚所以最小高度应当高于普通模式
          ${['side-right-no-footer', 'simple-no-footer'].includes($layoutType) &&
          css`
            min-height: calc(var(--layout-height) - var(--layout-header-height));
          `}

          ${['simple-all', 'side-right-all'].includes($layoutType) &&
          css`
            min-height: calc(
              var(--layout-height) - var(--layout-footer-height) - var(--layout-header-height)
            );
          `}
          max-height: var(--layout-height);
        }
      `}
    `}
  
    /**************************************
     *
     * 头部粘连会自己控制自己的粘连，无需考虑是否粘连
     * 
     * 仅需考虑内容区的最低高度不至于让底部坍塌
     *
     **************************************/
  ${({ $layoutType, $content }) =>
    $layoutType === 'no-side' &&
    css`
      & > .${$content} {
        scroll-behavior: smooth;
        min-height: calc(
          var(--layout-height) - var(--layout-header-height) - var(--layout-footer-height)
        );
      }
    `}
  /**************************************
   *
   * 只有页脚的布局
   *
   **************************************/    
  ${({ $layoutType }) =>
    $layoutType === 'only-footer' &&
    css`
      display: grid;
      grid-template-rows: auto var(--layout-footer-height);
      grid-template-columns: 1fr;
      gap: 0px;
      grid-template-areas: 'content' 'footer';
    `}

  /**************************************
   *
   * 仅头部布局
   *
   **************************************/
  ${({ $layoutType }) =>
    $layoutType === 'only-header' &&
    css`
      display: grid;
      grid-template-rows: var(--layout-header-height) auto;
      grid-template-columns: 1fr;
      gap: 0px;
      grid-template-areas: 'header' 'content';
    `}
    /**************************************
     *
     * 大块布局之只有侧栏
     *
     * 严格来说 
     * - 'side-full-only-side' 被转化为了 'simple-only-side'
     * - 'side-right-full-only-side' 被转化为了 'side-right-only-side'
     **************************************/
  // 标准的无头模式样式、侧边栏在右侧的无头模式样式
  ${({ $layoutType, $sidebar }) =>
    [
      'simple-only-side',
      'side-right-only-side',
      'side-full-only-side',
      'side-right-full-only-side',
    ].includes($layoutType) &&
    css`
      display: grid;
      // 横向空间占比设置
      grid-template-rows: max(100%, var(--layout-height)) auto;
      /* height: var(--layout-height); */
      gap: 0px;

      & > .${$sidebar} {
        top: 0;
      }
    `}
      
      ${({ $layoutType }) =>
    ['simple-only-side', 'side-full-only-side'].includes($layoutType) &&
    css`
      grid-template-columns: var(--layout-side-bar-width) auto;
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
    `}
`;
