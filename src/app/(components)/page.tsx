'use client';

import { LazyBackgroundRipple } from 'components/ripples';
import { _en } from 'customHooks/use-xcn';
import { usePathname } from 'next/navigation';

/**  组件展示的主页面  */
export default function WebHomePage() {
  const path = usePathname();

  const isHome = path === '' || path === '/';

  return (
    <LazyBackgroundRipple>
      <div className={_en('en-center')}>{isHome ? '欢迎回到首页' : '抱歉，页面未找到' + path}</div>
    </LazyBackgroundRipple>
  );
}
