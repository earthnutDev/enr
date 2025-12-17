'use client';

import styled from 'styled-components';
import { HeadersMode } from './Headers';
import { InputMemoTheme } from './Input';
import { ParagraphMode } from './paragraph';
import { RadioDemoTheme } from './Radio';
import { ToggleThemeColorMode } from './ToggleThemeMode';

const PageContainer = styled.div`
  scroll-behavior: smooth;
  margin-bottom: var(--en-spacing-10);

  & > div {
    margin: var(--en-font-size-base);
    padding: var(--en-font-size-base);
    border-radius: var(--en-radius-card);
    box-shadow: 0 1px 12px rgba(var(--en-text-primary-rgb), 0.23);
    transition: all calc(var(--en-transition-fast) * 8.6);
    &:hover {
      box-shadow: 0 1px 24px rgba(var(--en-text-primary-rgb), 0.4);
    }
  }
`;

/**  主题页面测试  */
export default function ThemePage() {
  return (
    <PageContainer>
      <ToggleThemeColorMode />
      <HeadersMode />
      <ParagraphMode />
      <InputMemoTheme />
      <RadioDemoTheme />
    </PageContainer>
  );
}
