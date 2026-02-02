import { styled, css } from 'styled-components';
import type { JSXComponent } from '../type';

/**
 *  开关的内容包装
 * @param props
 * @param props.$type
 */
export const SwitchContent: JSXComponent<{
  $type: 'left' | 'right';
}> = styled.div`
  cursor: pointer;
  position: relative;
  top: 0px;
  left: 0px;
  color: #000;
  display: inline-block;
  width: 54px;
  height: 27px;
  margin: 0;
  padding: 0;
  vertical-align: text-bottom;
  background-color: transparent;
  background-image:
    linear-gradient(to right, rgb(90, 90, 90), rgba(70, 120, 240)),
    radial-gradient(
      circle closest-corner at 100% 50%,
      rgb(90, 90, 90),
      rgb(90, 90, 90) 100%,
      transparent 100%
    ),
    radial-gradient(
      circle closest-corner at 0% 50%,
      rgba(70, 120, 240),
      rgba(70, 120, 240) 100%,
      transparent 100%
    );
  background-size:
    40% 50%,
    20% 50%,
    20% 50%;
  background-position:
    50% 50%,
    13.25% 50%,
    85% 50%;
  background-repeat: no-repeat;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    width: 40%;
    height: 80%;
    text-align: center;
    line-height: 1.3;
    font-size: 40%;
    border-radius: 50%;
    transition: all 1s;
    ${({ $type }) =>
      ($type === 'left' &&
        css`
          left: 15%;
          background-color: rgb(120, 120, 120);
        `) ||
      css`
        left: 45%;
        background-color: rgba(35, 70, 247, 1);
      `}
  }
`;
