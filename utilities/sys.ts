class SysInfo {
  #getMedia(str: string) {
    return (
      window?.matchMedia(/:/.test(str) && !/\(|\)/.test(str) ? `(${str})` : str)
        .matches ?? false
    );
  }
  /**
   * 设备振动
   **/
  vibrate() {
    if (window?.navigator?.vibrate) window.navigator.vibrate(200);
  }
  /**
   * 分享网站
   * @param [url='https://letmiseesee.pages.dev'] 网页地址 默认值 https://letmiseesee.pages.dev
   * @param [text='']  text  文本
   * @param [title='随笔记余生']  title  网站标题，缺省值
   * @description
   **/
  share(
    url: string = 'https://letmiseesee.pages.dev',
    text: string = '',
    title: string = '慧土灵核',
  ) {
    if (window?.navigator?.share) window.navigator.share({ url, text, title });
  }
  /**
   * 当前是否为手机设备
   **/
  isPhone(): boolean {
    return (
      !this.#getMedia('any-hover: hover') &&
      !this.#getMedia('any-pointer: fine') &&
      window?.navigator?.maxTouchPoints > 0
    );
  }

  /**
   * 当前设备是否为小平设备
   **/
  get isSmallScreen(): 'small' | 'middle' | 'large' {
    return this.#getMedia('max-width: 576px')
      ? 'small'
      : this.#getMedia('max-width: 996px')
        ? 'middle'
        : 'large';
  }

  /**
   * 是否为暗黑模式
   **/
  get isDark() {
    return this.#getMedia('prefers-color-scheme: dark');
  }
  /**
   * 设备当前的旋转状态
   *
   * 只返回是否旋转
   **/
  get isOrientation() {
    const orientation: OrientationType =
      (screen.orientation || {}).type ||
      /**  @ts-expect-error: 兼容 moz 浏览器  */
      screen.mozOrientation ||
      /**  @ts-expect-error: 兼容 ms 浏览器  */
      screen.msOrientation;
    /**
     *
     * - portrait-primary  旋转 360
     * - portrait-secondary 旋转 180
     * - landscape-primary  旋转  90
     * - landscape-secondary 旋转 270
     *
     *
     */
    if (
      orientation === 'landscape-primary' ||
      orientation === 'landscape-secondary'
    )
      return false;
    return true;
  }
}
export const sysInfo = new SysInfo();
