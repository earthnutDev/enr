import { ThemeColorModeProvider } from 'enr';
import type { Metadata } from 'next';
import '../css/common.scss';
import './product.scss';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import type { ColorMode } from 'zza';
import StyledComponentsRegistry from '../registry';

export const metadata: Metadata = {
  title: 'earthnut react ui 组件效果展示',
  description: 'earthnut react ui 的组件效果展示及测试效果开发',
};

/**
 *  项目根布局
 * @param root0
 * @param root0.children
 */
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
      <body>
        <ThemeColorModeProvider initialTheme={'dark'}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </ThemeColorModeProvider>
      </body>
    </html>
  );
}
