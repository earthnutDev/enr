'use client';
import styled from 'styled-components';
import type { JSXComponent, JSXComponentNoProps, PropsWithTagName } from '../type';
export type DetailsProps = {
  title?: string;
  children: React.ReactNode;
  open?: boolean;
};

const DetailsContext: JSXComponentNoProps<'details'> = styled.details`
  box-shadow: 0px 0px 12px 0px #f033;
  border-radius: 12px;
  padding: 30px;
  margin: 5px;
  transition: all 0.38s;
  position: relative;
  min-height: 2rem;
  max-height: 85vh;
  overflow: auto;
  &[open] {
    transition: all 0.68s;
    padding: 0px 10px 10px;
    box-shadow: 0px 0px 12px 4px #0af;
    summary {
      transition: all 0.68s;
      box-shadow: -1px 0px 6px 0px #f366;
      color: var(--en-text-primary);
      background-color: var(--en-background-primary);
      border-radius: 0px 0px 18px 18px;
    }
  }
`;

const SummaryContext: JSXComponentNoProps<'summary'> = styled.summary`
  position: sticky;
  position: -webkit-sticky;
  top: 0px;
  left: 10px;
  z-index: 30;
  padding: 15px 10px;
`;

/**
 *
 * @param DetailsProps
 * @param DetailsProps.open  是否默认展开
 * @param DetailsProps.children  子组件
 * @param DetailsProps.title   标题
 * @returns
 */
export const Details: JSXComponent<DetailsProps, 'details'> = ({
  title,
  children,
  open,
  ...props
}: PropsWithTagName<DetailsProps, 'details'>) => (
  <DetailsContext open={open} {...props}>
    <SummaryContext>{title || ''}</SummaryContext>
    {children}
  </DetailsContext>
);

Details.displayName = 'enr-Details';
