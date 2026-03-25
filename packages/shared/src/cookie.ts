/**
 * @module @zza/cookie
 * @file cookie.ts
 * @description cookie 管理
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @copyright 2026 ©️ Mr.MudBean
 * @since  01/10/2025
 * @version 0.0.0
 * @lastModified 2026-03-25 16:10
 */
import { typeOf } from 'a-type-of-js';

export const manageCookie = {
  getItem(keyItem: string) {
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            '(?:(?:^|.*;)\\s*' +
              encodeURIComponent(keyItem).replace(/[-.+*]/g, '\\$&') +
              '\\s*\\=\\s*([^;]*).*$)|^.*$',
          ),
          '$1',
        ),
      ) || null
    );
  },
  setItem(option: {
    keyItem: string;
    value: string;
    end?: string | number | Date;
    path?: string;
    domain?: string;
    secure?: string;
  }) {
    const { keyItem, value, end, path, domain, secure } = option;
    if (!keyItem || /^(?:expires|max-age|path|domain|secure)$/i.test(keyItem)) {
      return false;
    }
    let expires = '';

    switch (typeOf(end)) {
      case 'undefined':
        expires = '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        break;
      case 'number':
        expires =
          end === Infinity
            ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
            : '; max-age=' + end;
        break;
      case 'string':
        expires = '; expires=' + end;
        break;
      case 'date':
        expires = '; expires=' + (end as Date).toUTCString();
        break;
    }

    document.cookie = encodeURIComponent(keyItem)
      .concat('=')
      .concat(encodeURIComponent(value))
      .concat(expires)
      .concat(domain ? '; domain='.concat(domain) : '')
      .concat(path ? '; path='.concat(path) : '')
      .concat(secure ? '; secure' : '');
    return true;
  },
  deleteItem(key: string, path?: string, domain?: string) {
    if (!key || !this.exist(key)) return false;

    document.cookie = encodeURIComponent(key)
      .concat('=; expires=Thu, 01 Jan 1970 00:00:00 GMT')
      .concat(domain ? '; domain='.concat(domain) : '')
      .concat(path ? '; path='.concat(path) : '');
    return true;
  },
  /**  校验当前 key 是否存在 */

  exist(key: string) {
    const result = new RegExp(
      '(?:^|;\\s*)' +
        encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') +
        '\\s*\\=',
    ).test(document.cookie);
    return result;
  },
  keys() {
    const keyList = document.cookie
      .replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:1|$)/g, '')
      .split(/\s*(?:=[^;]*)?;\s*/);
    for (let i = 0; i < keyList.length; i++) {
      keyList[i] = decodeURIComponent(keyList[i]);
    }
    return keyList;
  },
};
