'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { ColorMode, ThemeColorModeProviderProps, ThemeContextType } from './types';
import { storageStore } from 'storage/storage-store';
import { manageCookie } from 'utilities/cookie';
import { sysInfo } from 'utilities/sys';
import { dog } from 'dog';

/**  用于判断是否正确放置的  */
const defaultCall = (): ColorMode => {
  return 'light';
};

const ThemeColorModeContext = createContext<ThemeContextType>({
  autoColorMode: true,
  colorModeClassName: 'en-light',
  colorMode: 'light',
  toggleColorMode: defaultCall,
  setColorMode: defaultCall,
  clearColorMode() {},
});

/**
 * 使用主题颜色模式
 *
 * ```ts
 * interface ThemeContextType {
 *   autoColorMode: boolean;
 *   colorMode: ColorMode;
 *   colorModeClassName: string;
 *   toggleColorMode: () => ColorMode;
 *   setColorMode: (newColorMode: ColorMode) => ColorMode;
 *   // 清理主题设置，让主题跟随系统
 *   clearColorMode: () => void;
 * }
 * ```
 */
export function useColorMode(): ThemeContextType {
  const result = useContext(ThemeColorModeContext);

  if (result.setColorMode === defaultCall || result.toggleColorMode === defaultCall) {
    console.warn('use ColorMode 应当在 <ThemeColorModeProvider /> 内部使用');
  }
  return result;
}

/**    */
export function ThemeColorModeProvider({ children, initialTheme }: ThemeColorModeProviderProps) {
  /**  颜色类型  */
  const [colorMode, setColorMode] = useState<ColorMode>(initialTheme);
  /**  是否为自动  */
  const [auto, setAuto] = useState<boolean>(true);
  /**  切换主题  */
  const toggleColorMode = () => {
    /**  新的主题色值  */
    const newColorMode: ColorMode = colorMode === 'light' ? 'dark' : 'light';
    return setSpecifiedColorMode(newColorMode);
  };
  /**  自动切换  */
  const autoChange = (newColorMode: ColorMode) => {
    dog.type = true;
    // 这是当前的
    const _auto = !storageStore.theme;
    dog('手动切换当前的模式', _auto);
    if (_auto) {
      manageCookie.deleteItem('theme');
      storageStore.theme = '';
    } else
      manageCookie.setItem({
        keyItem: 'theme',
        value: newColorMode,
      }); // 将值同步到 cookie ，以防止水合有误
    window.document.documentElement.setAttribute('data-theme', newColorMode);
    setAuto(_auto);
    dog.type = true;
  };
  /**  设置指定的色值  */
  const setSpecifiedColorMode = (newColorMode: ColorMode) => {
    dog.type = true;

    dog('执行设置当前的主题样式模式', newColorMode);

    if (['light', 'dark'].indexOf(newColorMode) < 0) {
      dog('新设置的模式不正确不允许设置');
      return colorMode;
    }

    storageStore.theme = newColorMode; // 将新的主题色值类型保存到本地
    // 设置新的值触发响应，新旧值不一致，自动触发 colorMode 更改的副作用 useEffect
    if (newColorMode !== colorMode) setColorMode(newColorMode);
    // 手动触发副作用
    else autoChange(colorMode);

    dog.type = true;
    return newColorMode;
  };

  /**  移除指定，设置为跟随系统  */
  const clear = () => {
    setAuto(true); // 设置为跟随系统
    setColorMode(sysInfo.isDark ? 'dark' : 'light'); // 设置新的值
    storageStore.theme = ''; // 移除本地的值
    manageCookie.deleteItem('theme'); // 移除本地的 cookie
  };

  useEffect(() => {
    /**  本地储存的值  */
    const storageOldColorMode = storageStore.theme;
    setAuto(!storageOldColorMode);
    /**  当前设备是否处于暗黑模式  */
    const systemPrefersDark = sysInfo.isDark;
    // 有旧值存在
    if (storageOldColorMode) setSpecifiedColorMode(storageOldColorMode);
    else
      // 否则初始化为当前设备的值
      setColorMode(systemPrefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    /**  当前的设备的暗黑模式是否开启  */
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    /**  如果本地没有储存值，则认为是系统默认值，接受系统暗黑模式事件  */
    const handleSystemChange = (e: MediaQueryListEvent) =>
      !storageStore.theme && setColorMode(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleSystemChange); // 监听
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  useEffect(() => {
    autoChange(colorMode);
  }, [colorMode]);

  return (
    /**  派发数据  */
    <ThemeColorModeContext.Provider
      value={{
        colorMode,
        colorModeClassName: `en-${colorMode}`,
        toggleColorMode,
        setColorMode: setSpecifiedColorMode,
        clearColorMode: clear,
        autoColorMode: auto,
      }}
    >
      {children}
    </ThemeColorModeContext.Provider>
  );
}
