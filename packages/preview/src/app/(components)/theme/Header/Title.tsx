'use client';
import { _en } from 'packages/enr/index.server';
import { styled } from 'styled-components';

const TitleContainer = styled.div`
  line-height: var(--layout-header-height);
  font-size: var(--en-font-large);
`;

/**  主题样式模型的头  */
export function ThemeModeTitle() {
  return (
    <TitleContainer className={_en('en-text-center', 'en-full-container')}>样式展示</TitleContainer>
  );
}
