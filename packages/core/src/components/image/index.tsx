'use client';

import { memo } from 'react';
import { styled } from 'styled-components';
import { xcn } from 'xcn';
import type { PropsWithTagName } from '../type';
import defaultImgSrc from './default.png';
import { useSrcChange } from './useSrcChange';

/**  片  */
const Content = styled.img`
  margin: 0;
  padding: 0;
  user-select: none;
`;

/**
 * ## 简单的图像
 *
 * @param props 属性对象
 * @param props.loadingSrc 等待替补图像地址
 */
export const Image = memo(
  ({
    loadingSrc = defaultImgSrc,
    ...props
  }: PropsWithTagName<
    {
      /**  下载错误时展示的图像  */
      errorSrc?: string;
      /**  加载中的图像  */
      loadingSrc?: string;
    },
    'img'
  >) => {
    const { resultSrc, loadComplete } = useSrcChange(props.src ?? loadingSrc);
    const { className, ..._props } = props;

    return (
      <Content
        src={resultSrc || loadingSrc}
        className={xcn(loadComplete === 1 && 'en-loading', className)}
        {..._props}
      />
    );
  },
);

Image.displayName = 'enr-image';
