import React from 'react';
import styles from './index.module.scss';
import { NavLink } from 'react-router';
import { xcn } from 'xcn';

/**
 * 左侧导航栏
 */
export default function MainTab() {
  // const path = useNavigation();

  const urlList: {
    text: string;
    url: string;
    type?: 'link';
  }[] = [
    {
      text: '首页',
      url: '',
    },
    {
      text: '延迟 ripple',
      url: '/lazy-ripplePage',
    },
    {
      text: '检测输入框输入状态',
      url: '/useInputIsComposing',
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
      url: '/useAnimationFrame',
    },
    {
      text: '主题',
      url: '/theme',
      type: 'link',
    },
  ];

  return (
    <nav>
      <ul>
        {urlList.map(e => (
          <li key={e.text}>
            <NavLink
              to={e.url}
              className={({ isActive, isPending }) =>
                xcn(
                  isPending ? 'pending' : isActive ? styles.active : '',
                  e.type === 'link' && styles.link,
                )
              }
            >
              {e.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
