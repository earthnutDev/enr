'use client';

import { TabList } from './types';
import { TabItem } from './TabItem';
import { xcn } from 'xcn';
import styles from './index.module.scss';

/**
 * 左侧导航栏
 */
export default function MainTab() {
  const urlList: TabList = [
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
  ];

  return (
    <div className={xcn(styles.tab)}>
      <nav>
        <ul>
          {urlList.map(e => (
            <li key={e.text}>
              <TabItem data={e} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
