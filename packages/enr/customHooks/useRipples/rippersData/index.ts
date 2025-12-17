/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName website
 * @FileName dataStore.ts
 * @CreateDate  周六  12/07/2024
 * @Description 数据库
 ****************************************************************************/

import { isNull } from 'a-type-of-js';
import { loadConfig } from './loadConfig';

// const id = 'earthnut_ripper_element_style';

/**
 * Ripple 使用的数据，Ripple 继承该类
 */
export class RipplesData {
  /**
   * canvas 元素
   */
  canvas: HTMLCanvasElement;
  /**
   * WebGL 绘图上下文
   */
  gl!: WebGLRenderingContext;
  /**
   * 配置
   */
  config: {
    type: number;
    linearSupport: boolean;
    extensions: string[];
    arrayType: Float32ArrayConstructor | null;
  } | null;

  /**
   * 初始化情况
   */
  initState = true;

  /**
   * 构造方法
   *
   * @param canvas  传入 canvas 元素来初始化必要的数据
   */
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl: WebGLRenderingContext | null = canvas.getContext('webgl');
    /**  浏览器不支持 WebGL  */
    if (isNull(gl)) {
      this.initState = false; /// 初始化失败
      this.config = null; /// 配置为 0
      return;
    }
    this.gl = gl;
    this.config = Reflect.apply(loadConfig, this, []);
  }
}

// if (isNull(document.querySelector(`style#${id}`))) {
//   const style = this.styleElement;
//   style.id = id;
//   style.innerHTML = `
//   .earthnut-ripples {
//     position: relative;
//     z-index: 0;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     transform: translate(0,0);
//   }
//   `;
//   const head = document.head;
//   if (head.prepend) head.prepend(style);
//   else head.insertBefore(style, head.firstChild);
// }
