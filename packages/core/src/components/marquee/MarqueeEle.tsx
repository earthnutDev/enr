'use client';

import { styled } from 'styled-components';
import type { PropsWithTagName } from '../type';
import './index.scss';

/**
 *  外层
 * @param props
 * @param props.$borderRadius
 */
const HoverContainer = styled.div<{ $borderRadius?: string }>`
  position: relative;
  box-sizing: border-box;
  border: 2px solid transparent;
  width: 100%;
  height: 100%;
  overflow: hidden;
  --en-marquee-border-radius: ${({ $borderRadius }) => $borderRadius};
  border-radius: var(--en-marquee-border-radius);
  border-image-width: 3px;
  /* border-image-outset: 5px; */
  cursor: pointer;
  animation: marqueeBorder 6s linear infinite;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  color: #333;
`;

/**
 *  一个跑马灯一样的东东
 *
 * @param props
 * @param props.borderRadius
 * @param props.children
 */
const MarqueeEle = ({
  borderRadius = '8px',
  ...props
}: PropsWithTagName<{
  borderRadius?: string;
}>) => {
  const { children, ..._props } = props;
  return (
    <HoverContainer $borderRadius={borderRadius} {..._props}>
      <Content>{children}</Content>
    </HoverContainer>
  );
};

MarqueeEle.displayName = 'enr-marquee';

export { MarqueeEle };
