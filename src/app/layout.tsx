import type { Metadata } from 'next';
import '@/css/common.scss';
import '@/css/reset.scss';
import './product.scss';
import StyledComponentsRegistry from '@/registry';
import { ReactNode } from 'react';
import { ColorMode, ThemeColorModeProvider } from 'index.client';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'earthnut react ui 组件效果展示',
  description: 'earthnut react ui 的组件效果展示及测试效果开发',
};

/**  项目根布局  */
export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  /**  主题设定  */
  const colorMode = (cookieStore.get('theme')?.value ?? 'light') as ColorMode;

  return (
    <html lang="zh-CN" data-theme={colorMode}>
      <body className="en-light">
        <ThemeColorModeProvider initialTheme={'dark'}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </ThemeColorModeProvider>
      </body>
    </html>
  );
}
