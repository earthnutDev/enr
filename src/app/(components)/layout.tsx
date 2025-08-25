import MainTab from '@/theme/Side-bar';
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSideBar } from '../../../index';
import { ReactNode } from 'react';
import { root_tab_bar_list } from './root-tab-list';
import { ComponentLayoutHeader } from '@/component/ComponentLayoutHeader';

/**  组件测试的根布局样式  */
export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <LayoutFooter>页脚</LayoutFooter>
      <LayoutContent>{children}</LayoutContent>
      <LayoutSideBar>
        <MainTab data={root_tab_bar_list} />
      </LayoutSideBar>
      <LayoutHeader>
        <ComponentLayoutHeader />
      </LayoutHeader>
    </Layout>
  );
}
