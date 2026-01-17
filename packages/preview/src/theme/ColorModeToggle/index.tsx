'use client';

import { useColorMode } from 'packages/enr/index.client';
import { HTMLAttributes } from 'react';

/**  主题色值模式切换  */
export function ColorModeToggle(props: HTMLAttributes<HTMLDivElement>) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div onClick={toggleColorMode} {...props}>
      {colorMode === 'light' ? '🌞' : '🌙'}
    </div>
  );
}
