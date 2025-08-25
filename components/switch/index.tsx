'use client';
import { isFunction } from 'a-type-of-js';
import { SwitchContent } from './SwitchContent';
import { HTMLAttributes } from 'react';
import { SwitchContainer } from './SwitchContainer';
import { SwitchLabel } from './SwitchLabel';

/**
 *  开关
 */
export function Switch({
  value,
  change,
  children,
  ...props
}: {
  value: boolean;
  change?: (e?: React.MouseEvent) => void;
} & HTMLAttributes<HTMLDivElement>) {
  const changed = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFunction(change)) Reflect.apply(change, null, [e]);
  };

  return (
    <SwitchContainer>
      {children && <SwitchLabel $type={value}>{children}</SwitchLabel>}
      <SwitchContent $type={value ? 'right' : 'left'} onClick={changed} {...props}></SwitchContent>
    </SwitchContainer>
  );
}
