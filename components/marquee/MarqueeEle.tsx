'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { styled } from 'styled-components';
import { MarqueeProps } from './type';
import './index.scss';

/**  外层  */
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
 */
const MarqueeEle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & MarqueeProps>(
  ({ borderRadius = '8px', children, ...props }, ref) => {
    return (
      <HoverContainer {...props} ref={ref} $borderRadius={borderRadius}>
        <Content>{children}</Content>
      </HoverContainer>
    );
  },
);

MarqueeEle.displayName = 'en-marquee';

export { MarqueeEle };
