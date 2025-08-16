import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import MainTab from 'page/tab';
import 'css/common.scss';
import './product.scss';
import styles from 'page/index.module.scss';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSideBar,
} from 'components/layout/layout';
import { xcn } from 'xcn';
import { useAnimationFrame } from 'customHooks/useAnimationFrame';

/**
 * 程序根
 */
export function App() {
  const cancelAnimation = useAnimationFrame((a, b) => console.log(a, b, a - b), {
    // immediately: true,
    // once: true,
  });

  useEffect(() => {
    // 不执行测试
    cancelAnimation.cancel();
  }, []);

  return (
    <Layout
      classes={xcn(styles.page)}
      onClick={() =>
        cancelAnimation.canceled ? cancelAnimation.render() : cancelAnimation.cancel()
      }
    >
      <LayoutHeader className={xcn('dark', 'red')}>头部区域</LayoutHeader>
      <LayoutSideBar className={xcn(styles.tab)} width={'150px'} right={true}>
        <MainTab />
      </LayoutSideBar>
      <LayoutContent className={xcn(styles.main)}>
        <Outlet></Outlet>
      </LayoutContent>
      <LayoutFooter>
        <div className={xcn('en-text-center')}>我是页脚，有点啥才好</div>
      </LayoutFooter>
    </Layout>
  );
}
