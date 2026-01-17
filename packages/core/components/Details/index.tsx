'use client';
import styled from 'styled-components';
export type DetailsProps = {
  title?: string;
  children: React.ReactNode;
  open?: boolean;
};

const DetailsContext = styled.details`
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

const SummaryContext = styled.summary`
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
export function Details({ title, children, open }: DetailsProps) {
  return (
    <DetailsContext open={open}>
      <SummaryContext>{title || ''}</SummaryContext>
      {children}
    </DetailsContext>
  );
}
