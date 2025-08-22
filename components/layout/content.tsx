import React from 'react';
import { xcn } from 'xcn';
import { LayoutContentContainer } from 'components/shared/EnLayoutContent';

/**
 *
 * layout content
 *
 *
 * @param {string} className  布局的类名
 *
 */
const InternalValueC = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
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
