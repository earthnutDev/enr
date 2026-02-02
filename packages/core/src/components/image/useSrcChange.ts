import { isString } from 'a-type-of-js';
import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import defaultImg from './default.png';

/**  图片最终的地址  */
type ImageSource = [
  /**  图片最终渲染的地址  */
  string,
  /** 更新图片地址的派发方法  */
  Dispatch<SetStateAction<string>>,
];

/**
 * 当地址触发变更
 * @param src
 * @param fallbackSrc
 */
export function useSrcChange(src: string, fallbackSrc?: string) {
  /** 实际展示的地址 */
  const [resultSrc, setResultSrc]: ImageSource = useState<string>(defaultImg);
  /** 当前状态
   *
   * - 0 初始化
   * - 1 加载中
   * - 2 加载完成
   * - 4 加载失败
   *
   */
  const [loadComplete, setLoadComplete] = useState<number>(0);

  useEffect(() => {
    setLoadComplete(1); /// 设置当前状态为未完成
    if (!isString(src)) src = defaultImg;
    // setResultSrc(src); /// 设置新的图片路径
    const img = new Image();

    img.onload = () => {
      /// 下载完毕后设置状态
      setLoadComplete(2);
      setResultSrc(src); /// 设置新的值
    };
    img.onerror = () => {
      setResultSrc(fallbackSrc || defaultImg); /// 下载出错则设置必用地址
      setLoadComplete(4); /// 设置为新的地址
    };

    img.src = src;
    img.crossOrigin = 'anonymous';
  }, [src, fallbackSrc]);

  return { resultSrc, loadComplete };
}
