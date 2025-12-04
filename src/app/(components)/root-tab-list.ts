import { TabList } from '@/theme/Sidebar/types';

export const root_tab_bar_list: TabList = [
  {
    label: '首页（延迟 ripple）',
    url: '/',
  },
  {
    label: '标准 ripple',
    url: '/ripples',
  },
  {
    label: '更多',
    url: '/details',
  },
  {
    label: '检测输入框输入状态',
    url: '/use-input-is-composing',
  },
  {
    label: '图片',
    url: '/image',
  },
  {
    label: '跑马灯',
    url: '/marquee',
  },
  {
    label: '使用关键帧',
    url: '/use-animation-frame',
  },
  {
    label: '主题',
    url: '/theme',
  },
  {
    label: '布局',
    url: '/layout',
  },
  {
    label: '样式',
    url: '/styles',
    type: 'link',
  },
];
