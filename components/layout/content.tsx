import { xcn } from 'xcn';
import { LayoutContentContainer } from 'components/shared/EnLayoutContent';
import { forwardRef, HTMLAttributes } from 'react';

/**
 *
 * layout content
 *
 *
 * @param {string} className  布局的类名
 *
 */
const InternalValueC = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <LayoutContentContainer
        // ref={ref}
        className={xcn('en-layout-main', className)}
        {...props}
        data-earthnut-ui="layout-content"
      />
    );
  },
);

InternalValueC.displayName = 'LayoutContent';

export { InternalValueC };
