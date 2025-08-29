'use client';

import { TabList } from './types';
import { TabItem } from './SidebarItem/Link';
import { styled } from 'styled-components';
import { HTMLAttributes } from 'react';

const NarContent = styled.div`
  grid-area: tab;
  overflow: auto;
  background-color: #000;
  border-radius: 12px;
  min-height: 100%;
`;

/**
 * 左侧导航栏
 */
export default function MainTab({
  data,
  ...props
}: { data: TabList } & HTMLAttributes<HTMLDivElement>) {
  return (
    <NarContent {...props}>
      <nav>
        <ul>
          {data?.map(e => (
            <TabItem data={e} key={e.text} />
          ))}
        </ul>
      </nav>
    </NarContent>
  );
}
