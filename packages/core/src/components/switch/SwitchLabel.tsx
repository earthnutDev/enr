import { css, styled } from 'styled-components';
import type { JSXComponent } from '../type';

export const SwitchLabel: JSXComponent<{ $type: boolean }> = styled.div`
  display: inline-block;
  vertical-align: super;
  transition: color 1.28s;
  ${({ $type }) =>
    ($type === true &&
      css`
        color: rgb(55, 80, 210);
        font-weight: 800;
      `) ||
    css`
      color: #666;
    `}
`;
