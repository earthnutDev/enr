'use client';

import { _en, LazyBackgroundRipple, type RippleEle } from 'enr';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

/**  组件展示的主页面  */
export default function WebHomePage() {
  const path = usePathname();

  const ref = useRef<RippleEle>(null);

  const isHome = path === '' || path === '/';

  return (
    <LazyBackgroundRipple
      option={{
        loadingBackgroundColor: ['#f00', '#0ff'],
        raindropsTimeInterval: 12000,
        imgUrl: [],
      }}
      ref={ref}
    >
      <div className={_en('center')}>{isHome ? '欢迎回到首页' : '抱歉，页面未找到' + path}</div>
    </LazyBackgroundRipple>
  );
}
