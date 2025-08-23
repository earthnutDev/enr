/**  颜色模式  */
export type ColorMode = 'light' | 'dark';

/**  主题  */
export type ThemeContextType = {
  /**  是否为自动模式 */
  autoColorMode: boolean;
  /** 获取颜色模式  */
  colorMode: ColorMode;
  /**  切换颜色模式  */
  toggleColorMode: () => ColorMode;
  /**  设置颜色模式（仅允许设置为 'dark'、或 `light`） */
  setColorMode: (newColorMode: ColorMode) => ColorMode;
  /**  设置为跟随系统  */
  clearColorMode: () => void;
};

export type ThemeColorModeProviderProps = {
  children: React.ReactNode;
  /**  初始化默认的主题值  */
  initialTheme: ColorMode;
};
