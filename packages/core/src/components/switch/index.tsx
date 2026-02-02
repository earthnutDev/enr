'use client';
import { isFunction } from 'a-type-of-js';
import type { HTMLAttributes } from 'react';
import { SwitchContainer } from './SwitchContainer';
import { SwitchContent } from './SwitchContent';
import { SwitchLabel } from './SwitchLabel';

/**
 *  开关
 * @param props
 * @param props.value
 * @param props.change
 * @param props.children
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
