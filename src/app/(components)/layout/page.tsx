'use client';
import {
  EnLayout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutSideBar,
} from 'components/layout';
import { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { Switch } from 'index.client';
import { _en } from 'index.server';

/** 测试组件的块，为了让其看起来更明显  */
const LayoutContainer = styled.div`
  border-width: 15px;
  border: 2rem solid;
  border-image: linear-gradient(to left, #0f03, #faf, #3693) 45;
  padding: 3rem;
  margin: 12px;
  border-radius: 8px;
  box-shadow: 1px 1px 12px #666;
  overflow: hidden;
`;

/**  布局测试页面  */
export default function LayoutDemoPage() {
  const [layoutVisible, setLayoutVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [contentVisible, setContentVisible] = useState(true);
  const [sideBarVisible, setSideBarVisible] = useState(true);
  const [footerVisible, setHooterVisible] = useState(true);
  const [headerNoSticky, setHeaderNoSticky] = useState(true);
  const [sidebarIsRight, setSidebarIsRight] = useState(false);
  const [sidebarIsFull, setSidebarIsFull] = useState(false);
  const [sidebarIsOverflow, setSidebarIsOverflow] = useState(false);
  const [contentIsOverflow, setContentIsOverflow] = useState(false);
  /**  列表  */
  const toggleVisibleList: [boolean, Dispatch<SetStateAction<boolean>>, string][] = [
    [layoutVisible, setLayoutVisible, '是否包含外壳'],
    [headerVisible, setHeaderVisible, '是否包含头部'],
    [contentVisible, setContentVisible, '是否包含内容'],
    [sideBarVisible, setSideBarVisible, '是否包含侧栏'],
    [footerVisible, setHooterVisible, '是否包含页脚'],
    [headerNoSticky, setHeaderNoSticky, '头部是否粘连'],
    [sidebarIsRight, setSidebarIsRight, '侧栏是否居右'],
    [sidebarIsFull, setSidebarIsFull, '侧栏是否占满全高'],
    [sidebarIsOverflow, setSidebarIsOverflow, '侧栏子数据是否超限'],
    [contentIsOverflow, setContentIsOverflow, '内容区是否超限'],
  ];
  const [layoutHeight, setLayoutHeight] = useState<string | number>(0.8);
  const [layoutWidth, setLayoutWidth] = useState<string | number>(0.8);
  const [headerHeight, setHeaderHeight] = useState<string | number>('2.8rem');
  const [footerHeight, setFooterHeight] = useState<string | number>('2.8rem');
  const [sideWidth, setSideWidth] = useState<string | number>(150);

  /**  输入型数据  */
  const inputValueList: [string | number, Dispatch<SetStateAction<string | number>>, string][] = [
    [layoutHeight, setLayoutHeight, '布局的高'],
    [layoutWidth, setLayoutWidth, '布局的宽'],
    [headerHeight, setHeaderHeight, '头部的高'],
    [footerHeight, setFooterHeight, '页脚的高'],
    [sideWidth, setSideWidth, '侧边的宽'],
  ];

  const Container = (
    <>
      {headerVisible && (
        <LayoutHeader height={headerHeight} noSticky={headerNoSticky}>
          头部
        </LayoutHeader>
      )}
      {sideBarVisible && (
        <LayoutSideBar
          width={sideWidth}
          right={sidebarIsRight}
          full={sidebarIsFull}
          className={_en()}
        >
          {new Array(sidebarIsOverflow ? 100 : 10).fill(1).map((e, i) => (
            <div key={i}>第 {i + 1} 个侧栏子项</div>
          ))}
        </LayoutSideBar>
      )}
      {contentVisible && (
        <LayoutContent>
          {new Array(contentIsOverflow ? 100 : 10).fill(1).map((e, i) => (
            <div key={i}>第 {i + 1} 个要元素</div>
          ))}
        </LayoutContent>
      )}
      {footerVisible && <LayoutFooter height={footerHeight}>页脚</LayoutFooter>}
    </>
  );

  /**  渲染测试的区块  */
  const layoutContent = layoutVisible ? (
    <EnLayout height={layoutHeight} width={layoutWidth}>
      {Container}
    </EnLayout>
  ) : (
    Container
  );

  return (
    <>
      <div>
        {toggleVisibleList.map(e => (
          <Switch key={e[2]} value={e[0]} change={() => e[1](!e[0])}>
            {e[2]}
          </Switch>
        ))}
        <div>
          {inputValueList.map(item => (
            <div key={item[2]} className={_en('en-inline-block', 'en-padding-4')}>
              <label className={_en('en-inline-block', 'en-padding-horizontal-12')}>
                {item[2]}
              </label>
              <input
                value={item[0]}
                className={_en('en-padding-horizontal-12')}
                onChange={e => item[1](e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      <LayoutContainer>{layoutContent}</LayoutContainer>
    </>
  );
}
