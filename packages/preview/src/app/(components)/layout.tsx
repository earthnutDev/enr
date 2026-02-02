import { _en, Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSideBar } from 'enr';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ComponentLayoutHeader } from '@/component/ComponentLayoutHeader';
import MainTab from '@/theme/Sidebar';
import { root_tab_bar_list } from './root-tab-list';
export const metadata: Metadata = {
  title: '组件部分',
  description: '组件效果展示及测试效果开发',
};
/**
 *  组件测试的根布局样式
 * @param root0
 * @param root0.children
 */
export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <Layout height={'100vh'} width={'100vw'}>
      <LayoutFooter>
        <div className={_en('center')}>页脚</div>
      </LayoutFooter>
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
