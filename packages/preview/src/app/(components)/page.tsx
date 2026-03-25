'use client';

import { _en, LazyBackgroundRipple, useColorMode, type RippleEle } from 'enr';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**  组件展示的主页面  */
export default function WebHomePage() {
  const path = usePathname();

  const ref = useRef<RippleEle>(null);

  const isHome = path === '' || path === '/';

  const { colorMode, setColorMode } = useColorMode();

  const [darkMode, setDarkMode] = useState(colorMode === 'dark');

  useEffect(() => {
    const localDarkMode = localStorage.getItem('theme');
    setDarkMode(localDarkMode === 'dark' || localDarkMode === JSON.stringify('dark'));
  }, [colorMode]);

  const handleChangeDarkMode = () => {
    const newDarkMode = !darkMode;
    const newLocalDarkModeData = newDarkMode ? 'dark' : 'light';
    setColorMode(newLocalDarkModeData);
    setDarkMode(newDarkMode);
  };

  return (
    <LazyBackgroundRipple
      option={{
        // loadingBackgroundColor: ['#f00', '#0ff'],
        raindropsTimeInterval: 12000,
        imgUrl: [],
        darkMode,
      }}
      ref={ref}
    >
      <div className={_en('center')}>{isHome ? '欢迎回到首页' : '抱歉，页面未找到' + path}</div>
      <div>
        <button onClick={handleChangeDarkMode}>{darkMode ? '🌚' : '🌝'} 模式</button>
      </div>
    </LazyBackgroundRipple>
  );
}
