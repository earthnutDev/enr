import MainTab from '@/theme/SideBar';
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSideBar } from '../../../index';
import { ReactNode } from 'react';
import { TabList } from '@/theme/SideBar/types';

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  const tabList: TabList = [
    {
      text: '首页（延迟 ripple）',
      url: '/',
    },
    {
      text: '标准 ripple',
      url: '/ripples',
    },
    {
      text: '检测输入框输入状态',
      url: '/use-input-is-composing',
    },
    {
      text: '图片',
      url: '/image',
    },
    {
      text: '跑马灯',
      url: '/marquee',
    },
    {
      text: '使用关键帧',
      url: '/use-animation-frame',
    },
    {
      text: '主题',
      url: '/theme',
      type: 'link',
    },
    {
      text: '布局',
      url: '/layout',
      type: 'link',
    },
  ];

  return (
    <Layout>
      <LayoutFooter>页脚</LayoutFooter>
      <LayoutContent>{children}</LayoutContent>
      <LayoutSideBar>
        <MainTab data={tabList} />
      </LayoutSideBar>
      <LayoutHeader>头部</LayoutHeader>
    </Layout>
  );
}
