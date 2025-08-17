import React from 'react';
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

/**
 * 程序根
 */
export function App() {
  return (
    <Layout classes={xcn(styles.page)}>
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
