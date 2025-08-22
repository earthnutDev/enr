'use client';

import styled from 'styled-components';
import { EnImageProps } from './types';
import defaultImgSrc from './default.png';
import { useSrcChange } from './useSrcChange';
import { xcn } from 'xcn';
import { forwardRef } from 'react';

/**  片  */
const Content = styled.img`
  margin: 0;
  padding: 0;
  user-select: none;
`;

/**  简单的图像  */
const Image = forwardRef<HTMLImageElement, EnImageProps>(
  ({ loadingSrc = defaultImgSrc, className, src, ...props }, ref) => {
    const { resultSrc, loadComplete } = useSrcChange(src ?? loadingSrc);

    return (
      <Content
        {...props}
        ref={ref}
        src={resultSrc || loadingSrc}
        className={xcn(loadComplete === 1 && 'loading', className)}
      />
    );
  },
);

Image.displayName = 'en-image';

export { Image };

export type { EnImageProps };
