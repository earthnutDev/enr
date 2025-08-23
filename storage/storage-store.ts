import { isBusinessEmptyString, isString } from 'a-type-of-js';
import { storageMainLogic } from './main-logic ';
import { ColorMode } from 'components/ThemeContext/types';

/**  storage 的数据仓库  */
export const storageStore = {
  /**  获取本地的数据中的主题值  */
  get theme(): ColorMode | '' {
    return storageMainLogic.get<ColorMode>('theme');
  },
  /**  设置本地的数据的主题值  */
  set theme(newTheme: ColorMode | '') {
    if (['light', 'dark'].includes(newTheme)) storageMainLogic.set('theme', newTheme);
    else if (isBusinessEmptyString(newTheme)) storageMainLogic.del('theme');
  },
  /**  获取本地储存的 token  */
  get token(): string {
    return storageMainLogic.get<string>('token');
  },
  /**  设置本地储存的 token 值  */
  set token(newToken: string) {
    if (isString(newToken) && !isBusinessEmptyString(newToken))
      storageMainLogic.set('token', newToken);
  },
};
