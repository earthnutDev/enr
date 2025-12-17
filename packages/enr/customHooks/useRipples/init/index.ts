import { isNull } from 'a-type-of-js';
import { render } from '../render';
import { Ripples } from '../ripplesClass';
import { setupPointerEvents } from './initEvent';
import { initShaders } from './initShaders';
import { initTexture } from './initTexture';
import { loadImage } from '../buildBackground/load-image';
import { bindImage } from '../buildBackground/utils/bind-image';

/**
 * 初始化 webGL
 */
export function initGL(this: Ripples) {
  const { renderData, options, fadeData } = this;

  if (isNull(renderData) || !this.config) return;

  const { textures, framebuffers } = renderData;
  const { resolution } = options;
  const gl = this.gl;
  const _resolution = 1 / resolution;
  renderData.textureDelta = new Float32Array([_resolution, _resolution]); // 纹理增量
  /// 加载扩展
  this.config.extensions.forEach(currentName => gl.getExtension(currentName));
  // 移除了在 window 监听页面尺寸变化，相反的，将监听注册在了父组件
  // window.removeEventListener('resize', this.updateSize);
  // this.updateSize = this.updateSize.bind(this); /// 大哥说这样可以让绘制框变成新的
  // window.addEventListener('resize', this.updateSize);

  // TODO
  const arrayType = this.config.arrayType;
  const textureData = arrayType ? new arrayType(resolution * resolution * 4) : null;
  const config = this.config;

  for (let i = 0; i < 2; i++) {
    /**  初始化 WebGLTexture 对象  */
    const texture = gl.createTexture();
    /**  初始化 WebGLFramebuffer 对象  */
    const framebuffer = gl.createFramebuffer();
    /**  将给定的 WebGLFramebuffer 绑定到目标  */
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    /**  将给定的 WebGLTexture 绑定给目标（绑定点）  */
    gl.bindTexture(gl.TEXTURE_2D, texture);
    /**  动画纹理  */
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      config.linearSupport ? gl.LINEAR : gl.NEAREST,
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MAG_FILTER,
      config.linearSupport ? gl.LINEAR : gl.NEAREST,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    /**
     *
     * (指定二维纹理图像)[https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texImage2D]
     *
     */
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      resolution,
      resolution,
      0,
      gl.RGBA,
      config.type,
      textureData,
    );

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    textures.push(texture);
    framebuffers.push(framebuffer);
  }

  // 初始化 gl 数据流
  renderData.quad = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, renderData.quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, +1, -1, +1, +1, -1, +1]),
    gl.STATIC_DRAW,
  );
  Reflect.apply(initShaders, this, []);
  Reflect.apply(initTexture, this, []);
  // 设置背景
  Reflect.apply(loadImage, this, []);
  // 设置透明背景色
  gl.clearColor(0, 0, 0, 0);
  // 设置颜色的混合方式
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // 插件初始化成功
  options.visible = true;
  options.running = true;

  Reflect.apply(setupPointerEvents, this, []); /// 初始化监听事件
  Reflect.apply(bindImage, this, [fadeData.lastDrawImage]); // 绑定初始化的默认纹理
  renderData.animationFrameId = requestAnimationFrame(() => Reflect.apply(render, this, []));
}
