'use client';
import { _en, Layout, LayoutContent, LayoutHeader, LayoutSideBar } from 'index.server';
import { ReactNode, useEffect } from 'react';
import { xcn } from 'xcn';
import { ThemeModeLayoutHeader } from './Header';
import { useColorMode } from 'index.client';
import MainTab from '@/theme/Sidebar';
import { tabList } from './tab-data';

/**    */
export default function ThemeModeLayout({ children }: { children: ReactNode }) {
  const { colorModeClassName } = useColorMode();

  useEffect(() => {
    const title = document.title;
    document.title = '主题';

    return () => ((document.title = title), void 0);
  }, []);

  return (
    <Layout
      width={'calc(100vw - 150px - 24px)'}
      height={'calc(100vh - 4.8rem - 24px)'}
      className={xcn(
        colorModeClassName,
        _en('en-radius-24', 'en-box-shadow-light-red-80', 'en-margin-12'),
      )}
    >
      <LayoutHeader
        style={{
          backgroundColor: 'var(--en-color-darkness-20)',
        }}
      >
        <ThemeModeLayoutHeader />
      </LayoutHeader>
      <LayoutSideBar right full>
        <MainTab
          data={tabList}
          style={{ backgroundColor: 'var(--en-color-darkness-70)' }}
        ></MainTab>
      </LayoutSideBar>
      <LayoutContent>{children}</LayoutContent>
    </Layout>
  );
}
