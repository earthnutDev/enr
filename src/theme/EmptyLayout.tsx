import { ReactNode } from 'react';

/**  空的 layout 占位  */
export function EmptyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
