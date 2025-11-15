'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TabItemProps } from '../../types';
import { css, styled } from 'styled-components';

/**  公用代码  */
const activeOrHover = css`
  color: #0a6;
  text-shadow: -1px 1px 0.5px #fff;
  font-weight: bolder;
`;

const LiContent = styled.li`
  width: 100%;
  text-align: center;
  margin: 15px auto;
  padding: 0px;
`;

/**  内容区  */
const LinkContent = styled.span<{
  $active?: boolean;
  $type?: 'link';
}>`
  display: inline-block;
  color: #aaa;
  padding: 5px 0px;
  width: 100%;
  transition: all 0.6s;
  /* type */
  ${({ $type }) =>
    $type === 'link' &&
    css`
      cursor: ne-resize;
      &::after {
        content: '⎋';
        color: #0f0;
        position: absolute;
        top: 0px;
        right: 8px;
        opacity: 0.5;
        transform: rotate(80deg);
      }
    `}

  &:hover {
    ${activeOrHover}
    color: #f63;
    cursor: pointer;
  }

  ${({ $active }) =>
    $active &&
    css`
      ${activeOrHover}
      &:hover {
        color: #0a6;
        cursor: not-allowed;
      }
    `}
`;

/**  链接子项  */
export function TabItem({ data }: TabItemProps) {
  const path = usePathname();

  const isActive = (path === '/' && data.url == '') || (path !== '/' && data.url.startsWith(path));

  return (
    <LiContent>
      <Link href={data.url}>
        <LinkContent $type={data.type} $active={isActive}>
          {data.label}
        </LinkContent>
      </Link>
    </LiContent>
  );
}
