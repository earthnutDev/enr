import type { EnLayoutContentType } from '../../layout/types';

/**  组件的样式 (内部使用)  */
export type EnLayoutContentProps = {
  $header: string;
  $content: string;
  $sidebar: string;
  $footer: string;
  $main: string;
  $headerNoSticky: boolean;
  $layoutType: EnLayoutContentType;
};
