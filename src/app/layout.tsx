import type { Metadata } from 'next';
import '@/css/common.scss';
import '@/css/reset.scss';
import './product.scss';
import StyledComponentsRegistry from '@/registry';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'earthnut react ui 组件效果展示',
  description: 'earthnut react ui 的组件效果展示及测试效果开发',
};

/**  项目根布局  */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
