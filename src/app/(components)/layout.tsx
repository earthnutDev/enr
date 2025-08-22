import MainTab from '@/component/bar';
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSideBar } from '../../../index';

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
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
