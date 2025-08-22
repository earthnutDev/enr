import MainTab from '@/component/bar';
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSideBar } from '../../../index';
import { ReactNode } from 'react';

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <LayoutFooter>页脚</LayoutFooter>
      <LayoutHeader>头部</LayoutHeader>
      <LayoutContent>{children}</LayoutContent>
      <LayoutSideBar>
        <MainTab />
      </LayoutSideBar>
    </Layout>
  );
}
