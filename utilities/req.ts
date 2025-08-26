/***********************************************
 *  @Author earthnut
 *  @Email earthnut.dev@outlook.com
 *  @ProjectName website
 *  @FileName req.ts
 *  @CreateDate  周四  01/09/2025
 *  @Description req 请求
 **************************************************/

import { typeOf } from 'a-type-of-js';
import { global_config_data } from 'data/config';

/** 请求参数 */
export type RequestOptions<T> = RequestInit & {
  data?: string | object | T;
};

/**  请求配置参数 */
export type ReqOptions = {
  /**  域名 **/
  domain: string;
  /**  端口 */
  port: number;
  /** headers */
  headers: HeadersInit;
};

/**  请求 */
export class Req {
  options: ReqOptions = {
    domain: global_config_data.domain,
    port: 9863,
    headers: {
      'X-source': 'Cloudflare-Workers',
    },
  };

  constructor() {
    Object.defineProperties(this, {
      options: {
        value: this.options,
        writable: true,
        enumerable: true,
        configurable: true,
      },
    });
  }

  /**  私有属性，保证 beforeRequest 只能被调用一次  */
  private beforeRequestHasCalled: boolean = false;
  /**
   * 请求前要执行的逻辑
   **/
  beforeRequest(callback: (options: ReqOptions) => void) {
    // if (this.beforeRequestHasCalled === true) {
    //   // throw new Error('该方法仅且允许调用一次');
    // } else {
    //   this.beforeRequestHasCalled = true;
    // }
    Reflect.apply(callback, null, [this.options]);
  }
  /**  私有属性，保证 afterResponse 只能被调用一次  */
  private afterResponseHasCalled: boolean = false;
  /**
   * 请求后的数据
   **/
  afterResponse() {
    // if (this.afterResponseHasCalled === true) {
    //   // throw new Error('该方法仅且允许调用一次');
    // } else {
    //   this.afterResponseHasCalled = true;
    // }
  }

  /**  使用 get 获取 text 数据 **/
  async getText(url: string) {
    const result = await this.get(url);
    if (result === null) {
      return null;
    }
    try {
      return await result.text();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**  使用 get 获取 json 数据 **/
  async getJson<T>(
    url: string,
    data?: string | Record<string, string>,
    option?: RequestInit,
  ): Promise<T | null> {
    if (typeof data === 'string') url += data;
    else if (typeof data === 'object') {
      if (URLSearchParams) url += new URLSearchParams(data).toString();
      else
        url += Object.keys(data)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(key))
          .join('&');
    }

    const result = await this.get<T>(url, option);
    if (result === null) {
      return null;
    }
    try {
      return await result.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 'Content-Type': 'application/json',

  async postJson<T>(url: string, data?: string | object, option?: RequestInit): Promise<T | null> {
    try {
      const result = await this.post(url, data, option);
      if (result === null) return null;
      return await result?.json();
    } catch (error) {
      console.log(error);
    }

    return null;
  }
  async postText(
    url: string,
    data?: string | object,
    option?: RequestInit,
  ): Promise<string | null> {
    try {
      const result = await this.post(url, data, option);
      if (result === null) return null;
      return await result?.text();
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  /**
   * - application/json
   * - application/x-www-form-urlencoded
   **/
  async post(url: string, data?: string | object, option?: RequestInit): Promise<Response | null> {
    const dataType = typeOf(data);
    const options: RequestInit =
      dataType == 'object'
        ? {
            method: 'post',
            body: JSON.stringify(data),
            ...option,
            headers: {
              'Content-Type': 'application/json',
              ...option?.headers,
            },
          }
        : dataType === 'string'
          ? {
              body: data as string,
              ...option,
              headers: {
                'Content-Type': 'application/json',
                ...option?.headers,
              },
            }
          : { ...option };
    try {
      return await this.requestData(url, options);
    } catch (error) {
      console.log(error);
    }

    return null;
  }

  /**
   * 使用 get
   * @param url 请求的网址
   **/
  async get<T>(url: string, options?: RequestOptions<T>) {
    return await this.requestData(url, options);
  }

  private async requestData(url: string, options?: RequestInit) {
    /**  解析请求 url  */
    const _parseUrl = this.parseUrl(url);
    try {
      const fetchOptions: RequestInit = {
        method: 'get',
        mode: 'cors',
        cache: 'no-cache',
        /**
         * - include 是包含 cookie
         **/
        credentials: 'include',
        redirect: 'follow',
        referrerPolicy: 'same-origin',
        referrer: 'https://lmssee.com',
        ...options,
        /** 防止非原始类型数据被覆盖 */
        headers: {
          referer: 'https://lmssee.com',
          ...this.options.headers,
          ...options?.headers,
          'X-source': 'Cloudflare-Workers',
        },
      };
      /**  服务端删除不支持的 mode 的属性  */
      if (typeof window === 'undefined') {
        delete fetchOptions.mode;
        delete fetchOptions.credentials;
        delete fetchOptions.referrer;
        delete fetchOptions.referrerPolicy;
        delete fetchOptions.cache;
      }
      return await fetch(_parseUrl, fetchOptions);
    } catch (error) {
      console.log('接口请求出现错误', url, error);
      return null;
    }
  }

  /**  解析 url 请求 */
  private parseUrl(url: string) {
    url = decodeURIComponent(url);
    const { options } = this;
    /**  使用 URL.parse 解析  */
    const parseUrl = URL.parse(url, `${options.domain}:${options.port}`);
    if (parseUrl === null) {
      if (url.startsWith('http')) return url;
      else {
        const originUrl = `${this.options.domain}:${this.options.port}/${url.replace(/^\//, '')}`;
        return originUrl;
      }
    }
    return parseUrl;
  }
}

export const req = new Req();
