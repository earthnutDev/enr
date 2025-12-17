/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName website
 * @FileName tools.ts
 * @CreateDate  周六  12/07/2024
 * @Description  工具
 ****************************************************************************/

import { setStyle } from 'a-element-inline-style';
import { Ripples } from './ripplesClass';
import { Program } from './types';
import { isNull } from 'a-type-of-js';

/**
 *
 *  增加 WebGLProgram
 *
 *
 */
export function createProgram(
  vertexSource: string,
  fragmentSource: string,
  gl: WebGLRenderingContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _uniformValues?: string,
) {
  /**
   * 编译一个着色器
   */
  function compileSource(type: GLenum, source: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source); /// 设置 WebGLShader 着色器
    gl.compileShader(shader); /// 编译一个着色器，使其成为二进制数据，然后就可以被 WebGLProgram 对象所使用
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error('compile error: ' + gl.getShaderInfoLog(shader));
    return shader;
  }

  const program: Program = {
    id: gl.createProgram(),
    uniforms: {},
    locations: {},
  };
  /**  向 WebGLProgram 添加一个片段  */
  gl.attachShader(program.id, compileSource(gl.VERTEX_SHADER, vertexSource));
  /**  向 WebGLProgram 添加一个顶点着色器  */
  gl.attachShader(program.id, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program.id); /// 链接给定的 WebGLProgram ，从而完成程序的片元和顶点着色器准备
  if (!gl.getProgramParameter(program.id, gl.LINK_STATUS))
    throw new Error('link error: ' + gl.getProgramInfoLog(program.id));
  gl.useProgram(program.id);
  gl.enableVertexAttribArray(0);
  let match;

  const shaderCode = vertexSource + fragmentSource;
  /**  待搜索的正则表达式  */
  const regex = /uniform (\w+) (\w+)/g;
  /**
   * 多次匹配
   *
   * 并在找不到时返回 null
   *
   * 每一次匹配都会更新 lastIndex 的数值
   *
   * 该方法是正则表达式的原始方法，强大而有效，但通常不能表达清楚调用的目的
   */
  while (!isNull((match = regex.exec(shaderCode)))) {
    const name = match[2];
    program.locations[name] = gl.getUniformLocation(program.id, name)!;
  }
  return program;
}

/**
 *
 * 绑定纹理
 *
 */
export function bindTexture(this: Ripples, texture: WebGLTexture, unit: number = 0) {
  const gl = this.gl;
  /**  激活纹理单元  */
  gl.activeTexture(gl.TEXTURE0 + (unit || 0));
  /**  将给定的 WebGLTexture 绑定到目标点  */
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

/**
 * 给 canvas 设置样式
 */
export function setCanvasStyle(canvas: HTMLCanvasElement) {
  const parentElement = canvas.parentElement!;
  canvas.width = parentElement.clientWidth;
  canvas.height = parentElement.clientHeight;
  // 给 canvas 元素赋值行内样式
  setStyle(canvas, {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    pointerEvents: 'none',
  });
}

/**  背景色值为空  */
export function isNoneBackGroundColor(color: string): boolean {
  return color === 'rgba(0, 0, 0, 0)' || color === '#ffffffff' || color === 'transport';
}

/**  背景图为空  */
export function isNoneBackgroundImage(src: string): boolean {
  return src === 'none' || src === '';
}
