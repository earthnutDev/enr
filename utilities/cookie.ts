/*****************************************************
 *  @Author earthnut
 *  @Email earthnut.dev@outlook.com
 *  @ProjectName nest
 *  @FileName cookie.ts
 *  @CreateDate  周五  01/10/2025
 *  @Description cookie 管理
 ******************************************************/
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
        expires = end === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + end;
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
  deleteItem(key: string, path: string, domain: string) {
    if (!key || !this.exist(key)) {
      return false;
    }
    document.cookie = encodeURIComponent(key)
      .concat('=; expires=Thu, 01 Jan 1970 00:00:00 GMT')
      .concat(domain ? '; domain='.concat(domain) : '')
      .concat(path ? '; path='.concat(path) : '');
  },
  exist(key: string) {
    return new RegExp(
      '(?:^|;\\s*)' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=',
    ).test(key);
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
