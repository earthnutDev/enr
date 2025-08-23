import { Navbar } from '@/theme/Navbar';
import MainTab from '@/theme/SideBar';
import { TabList } from '@/theme/SideBar/types';
import {
  EnLayout,
  EnLayoutContent,
  EnLayoutFooter,
  EnLayoutHeader,
  EnLayoutSideBar,
} from 'components/layout';
import { ReactNode } from 'react';

export default function LayoutRootLayout({ children }: { children: ReactNode }) {
  const tabList: TabList = [];

  return (
    <EnLayout>
      <EnLayoutHeader>
        <Navbar></Navbar>
      </EnLayoutHeader>
      <EnLayoutContent>{children}</EnLayoutContent>
      <EnLayoutSideBar>
        <MainTab data={tabList} />
      </EnLayoutSideBar>
    </EnLayout>
  );
}
