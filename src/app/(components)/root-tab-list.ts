import { TabList } from '@/theme/Sidebar/types';

export const root_tab_bar_list: TabList = [
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
  },
  {
    text: '布局',
    url: '/layout',
    type: 'link',
  },
];
