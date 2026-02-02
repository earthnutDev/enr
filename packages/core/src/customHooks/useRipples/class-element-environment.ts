/**
 * @packageDocumentation
 * @module @enr/class-test-envelop
 * @file class-element-environment.ts
 * @description _
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-26 01:24
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-01 06:00
 */

import { isNull } from 'a-type-of-js';
import { dog, dun } from 'zza/log';

/**
 * ## 执行环境校验并初始化 WebGl
 */
export class ElementEnvironment {
  /** 父级节点 */
  parentNode: HTMLElement;

  /** webGl 上下文 */
  gl: WebGLRenderingContext;

  /** ## webGL 扩展 */
  readonly glExtensions: { [x: string]: any | null };

  /** 配置 */
  readonly config: {
    type: number;
    linearSupport: boolean;
    extensions: string[];
    arrayType: Float32ArrayConstructor | null;
  };

  /**
   *
   * @param canvas 画布元素
   */
  constructor(public readonly canvas: HTMLCanvasElement) {
    this.parentNode = canvas.parentElement ?? globalThis?.document?.body ?? null;
    if (isNull(this.parentNode)) {
      throw new Error('未捕获到 canvas 的父级节点元素');
    }
    const gl: WebGLRenderingContext | null = this.canvas.getContext('webgl');
    /**  浏览器不支持 WebGL  */
    if (isNull(gl)) {
      throw new Error('当前浏览器不支持 WebGL');
    }
    this.gl = gl;
    this.glExtensions = this.initializeExtensions();
    try {
      this.config = this.initializeConfig();
    } catch (error) {
      const msg = '初始化配置出现问题，当前环境不支持 WebGl 渲染';
      if (dun) {
        dog.error(msg, error);
      }
      throw new Error(msg);
    }
  }

  /** 初始化 extensions  */
  private initializeExtensions() {
    const result = Object.fromEntries(
      [
        'OES_texture_float',
        'OES_texture_half_float',
        'OES_texture_float_linear',
        'OES_texture_half_float_linear',
      ].reduce((previousValue: [string, any | null][], currentName) => {
        const currentExtension = this.gl.getExtension(currentName);
        if (currentExtension) previousValue.push([currentName, currentExtension]);
        return previousValue;
      }, []),
    );

    return result;
  }
  /**
   * ## 执行的配置数据
   * 该方法**并不总是能如期执行**：
   *  - 设备不支持构建 webGl 环境时将抛出错误
   */
  private initializeConfig() {
    /**  如果不支持浮点扩展，我们可以提前退出  */
    if (!this.glExtensions.OES_texture_float) throw new Error('不支持的浮点扩展');

    /**  配置  */
    const configs = [];
    const { gl, glExtensions } = this;

    configs.push(this.createConfig('float', gl.FLOAT, Float32Array));

    /**
     * 数组类型应该是 Uint16Array，但至少在 iOS 上会中断。在这种情况下，我们
     * 只需使用 data=null 而不是 data=new Uint16Array（...） 初始化纹理即可。
     * 这使得初始化速度稍慢，但仍然可以忽略不计。
     */
    if (glExtensions.OES_texture_half_float) {
      configs.push(
        this.createConfig('half_float', glExtensions.OES_texture_half_float.HALF_FLOAT_OES, null),
      );
    }

    /** 纹理   */
    const texture = gl.createTexture();
    /**  数据流  */
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    /**  检测每一个纹理的支持情况  */
    let config = null;

    for (let i = 0; i < configs.length; i++) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, configs[i].type, null);

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      /** 检测当前的状态 */
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        config = configs[i];
        break;
      }
    }

    if (config === null) {
      throw new Error('没有支持的 WebGl 环境');
    }

    return config;
  }

  /**
   * ## 创建配置数据
   * @param type 构建类型
   * @param glType gl 类型
   * @param arrayType 构建数组类型
   */
  private createConfig(type: string, glType: number, arrayType: Float32ArrayConstructor | null) {
    /**   webGL 扩展名  */
    const name = 'OES_texture_' + type;
    /**  webGL 扩展名  */
    const nameLinear = name + '_linear';
    /**  是否支持线性过滤  */
    const linearSupport = nameLinear in this.glExtensions;

    return {
      type: glType,
      linearSupport,
      arrayType,
      extensions: linearSupport ? [name, nameLinear] : [name],
    };
  }
}
