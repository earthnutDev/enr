import { LayoutFooterProps } from './types';
import { xcn } from 'xcn';
import { LayoutFooterContent } from 'components/shared/EnLayoutContent';
import { forwardRef } from 'react';

/**
 *
 * layout footer
 *
 * 布局底部
 *
 * @param className 自定义类名
 * @param height 自定义高度
 * @param props 其他属性
 * @returns ReactElement
 *
 */
const InternalValueF = forwardRef<
  HTMLDivElement,
  LayoutFooterProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ className, height, ...props }, ref) => {
  return (
    <LayoutFooterContent
      ref={ref}
      {...props}
      className={xcn('en-layout-footer', className)}
      data-enr-ui="layout-footer"
    />
  );
});

InternalValueF.displayName = 'LayoutFooter';

export { InternalValueF };
