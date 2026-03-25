import { useImperativeHandle, type RefObject } from 'react';
import { styled } from 'styled-components';
import type { Ripples } from '../../customHooks/useRipples/class-ripple';
import type { JSXComponent } from '../type';
import { createImperativeHandle } from './imperative-handle';
import type { BackgroundRipplesProps } from './types';
import { useOptionUpdate } from './use-option-update';

/**  内容组件  */
export const Content: JSXComponent = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-width: 1px;
  min-height: 1px;
  contain: layout paint style;
  will-change: transform, opacity;
`;
/** 公共使用部分 */
export const ComponentContent = ({
  option,
  ripplesRef,
  canvas,
  ...props
}: BackgroundRipplesProps & {
  ripplesRef: RefObject<Ripples | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
}) => {
  const { children, style, ref, ..._props } = props;
  ///  使用 配置更新
  useOptionUpdate(ripplesRef, option);

  // 抛出事件 (自定义抛出事件)
  useImperativeHandle(ref, createImperativeHandle(ripplesRef));

  return (
    <Content
      style={{
        backgroundRepeat: 'round',
        ...style,
      }}
      {..._props}
    >
      <canvas ref={canvas} data-earthnut-ui="canvas" width={0} height={0} />
      {children}
    </Content>
  );
};
