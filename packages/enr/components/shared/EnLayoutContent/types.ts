import { EnLayoutContentType } from 'components/layout/types';

/**  组件的样式  */
export interface EnLayoutContentProps {
  $header: string;
  $content: string;
  $sidebar: string;
  $footer: string;
  $main: string;
  $headerNoSticky: boolean;
  $layoutType: EnLayoutContentType;
}
