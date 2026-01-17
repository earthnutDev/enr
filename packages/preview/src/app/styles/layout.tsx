import MainTab from '@/theme/Sidebar';
import {
  EnLayout,
  EnLayoutContent,
  EnLayoutFooter,
  EnLayoutHeader,
  LayoutSideBar,
} from 'components/layout';
import { _en } from 'packages/enr/index.server';
import { ReactNode } from 'react';
import { styles_tab_bar_list } from './tab-list';

/**
 * 样式类的结构
 */
export default function StylesLayout({ children }: { children: ReactNode }) {
  return (
    <EnLayout width={'100vw'} height={'100vh'}>
      <EnLayoutHeader>
        <div className={_en('en-center')}>我是头部</div>
      </EnLayoutHeader>
      <LayoutSideBar>
        <MainTab data={styles_tab_bar_list} />
      </LayoutSideBar>
      <EnLayoutContent>{children}</EnLayoutContent>
      <EnLayoutFooter>
        <div className={_en('en-center')}>我是页脚</div>
      </EnLayoutFooter>
    </EnLayout>
  );
}
