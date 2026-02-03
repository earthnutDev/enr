/**
 * @packageDocumentation
 * @module @enr/class-webgl
 * @file class-webgl.ts
 * @description 构建 webGl
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-22 02:44
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-03 05:27
 */

import { isNull, isZero } from 'a-type-of-js';
import { dog, dun } from 'zza/log';
import type { BuildBackground } from './class-build-background';
import type { ElementEnvironment } from './class-element-environment';
import type { ElementMeta } from './class-html-element-meta';
import type { RippleParam } from './class-param';
import type { Program, Textures } from './types';

/**
 * ## webGl
 */
export class RippleGl {
  /** WebGl 上下文 */
  readonly gl: WebGLRenderingContext;
  /**
   * ## 渲染数据流
   * 该值在 init 中进行初始化
   */
  quad: WebGLBuffer = null as never;

  /**  该值于初始化着色器时初始化  */
  dropProgram!: Program;

  /**  更新流  */
  updateProgram!: Program;

  /**  纹理  */
  textures: Textures = [];
  /**  背景纹理  */
  backgroundTexture: WebGLTexture = [];
  /**  纹理数据  */
  textureDelta!: Float32Array<ArrayBuffer>;
  /**    */
  framebuffers: WebGLFramebuffer[] = [];
  /**    */
  bufferWriteIndex: number = 0;
  /**    */
  bufferReadIndex: number = 1;

  /**  渲染程序  */
  renderProgram!: Program;

  /**
   * ## 顶点着色器
   */
  private readonly vertexShader = `
      attribute vec2 vertex;
      varying vec2 coord;
      void main() {
        coord = vertex * 0.5 + 0.5;
        gl_Position = vec4(vertex, 0.0, 1.0);
      }`;

  /**
   * ## 更新程序片段源
   */
  private readonly updateProgramFragmentSource = `
      precision highp float;

      uniform sampler2D texture;
      uniform vec2 delta;

      varying vec2 coord;

      void main() {
        vec4 info = texture2D(texture, coord);
  
        vec2 dx = vec2(delta.x, 0.0);
        vec2 dy = vec2(0.0, delta.y);
  
        float average = (
          texture2D(texture, coord - dx).r +
          texture2D(texture, coord - dy).r +
          texture2D(texture, coord + dx).r +
          texture2D(texture, coord + dy).r
        ) * 0.25;
  
        info.g += (average - info.r) * 2.0;
        info.g *= 0.995;
        info.r += info.g;
  
        gl_FragColor = info;
      }
      `;

  /**
   * ## 渲染顶点源
   */
  private readonly renderVertexSource = `
        precision highp float;

        attribute vec2 vertex;
        uniform vec2 topLeft;
        uniform vec2 bottomRight;
        uniform vec2 containerRatio;
        varying vec2 ripplesCoord;
        varying vec2 backgroundCoord;
        void main() {
          backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);
          backgroundCoord.y = 1.0 - backgroundCoord.y;
          ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;
          gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);
        }
      `;
  /**
   * ## 渲染程序片段源代码
   */

  private readonly renderProgramFragmentSource = `
        precision highp float;

        uniform sampler2D samplerBackground;
        uniform sampler2D samplerRipples;
        uniform vec2 delta;

        uniform float perturbation;
        varying vec2 ripplesCoord;
        varying vec2 backgroundCoord;

        void main() {
          float height = texture2D(samplerRipples, ripplesCoord).r;
          float heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;
          float heightY = texture2D(samplerRipples, vec2(ripplesCoord.x, ripplesCoord.y + delta.y)).r;
          vec3 dx = vec3(delta.x, heightX - height, 0.0);
          vec3 dy = vec3(0.0, heightY - height, delta.y);
          vec2 offset = -normalize(cross(dy, dx)).xz;
          float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);
          gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbation) + specular;
        }`;
  /**
   * ## 丢弃程序片段源
   */
  private readonly dropProgramFragmentSource = `precision highp float;

      const float PI = 3.141592653589793;
      uniform sampler2D texture;
      uniform vec2 center;
      uniform float radius;
      uniform float strength;

      varying vec2 coord;

      void main() {
        vec4 info = texture2D(texture, coord);

        float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);
        drop = 0.5 - cos(drop * PI) * 0.5;
        info.r += drop * strength;
        gl_FragColor = info;
      }`;

  /**
   * ## 渲染 WebGl 支持
   * 该类**并不总能如期执行** ：
   *   - 当当前宿主不支持 WebGl 时将抛出错误
   *   - 当当前设备不支持 WebGl 某些特性时将抛出错误
   *
   * @param element
   * @param options 用户使用参数
   * @param elementMeta 传入 canvas 元素来初始化必要的数据
   * @param buildBackground
   */
  constructor(
    private readonly element: ElementEnvironment,
    private readonly options: RippleParam,
    private readonly elementMeta: ElementMeta,
    private readonly buildBackground: BuildBackground,
  ) {
    this.gl = this.element.gl;
    this.initGLEnvironment(); /// 初始化 GL 渲染粒子（动画）
  }

  // ++++++++++++++++++++++ 》〉》〉》〉》 初始化 GL ++++++++++++++++++++++

  /**
   * 初始化 webGL
   */
  private initGLEnvironment() {
    const { options, gl, element } = this;
    const { resolution } = options;
    const { config } = element;
    const _resolution = 1 / resolution;
    this.textureDelta = new Float32Array([_resolution, _resolution]); // 纹理增量
    /// 加载扩展
    config.extensions.forEach(currentName => gl.getExtension(currentName));
    // 移除了在 window 监听页面尺寸变化，相反的，将监听注册在了父组件
    // window.removeEventListener('resize', this.updateSize);
    // this.updateSize = this.updateSize.bind(this); /// 大哥说这样可以让绘制框变成新的
    // window.addEventListener('resize', this.updateSize);

    // TODO
    const arrayType = config.arrayType;
    const textureData = arrayType ? new arrayType(resolution * resolution * 4) : null;

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
      this.textures.push(texture);
      this.framebuffers.push(framebuffer);
    }

    // 初始化 gl 数据流
    this.quad = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, +1, -1, +1, +1, -1, +1]),
      gl.STATIC_DRAW,
    );

    this.initShaders();
    this.initTexture();
    // TODO ：这里有较强的耦合性，需要优化加载图片的时机
    //  设置背景
    this.buildBackground.setImage();
    // 设置透明背景色
    gl.clearColor(0, 0, 0, 0);
    // 设置颜色的混合方式
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  /**
   * ## 初始化纹理
   */
  private initTexture() {
    const { gl } = this;
    const _backgroundTexture = (this.backgroundTexture = gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, _backgroundTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  /**
   * ## 初始化着色器
   */
  private initShaders() {
    const { gl } = this;

    this.dropProgram = this.createProgram(this.vertexShader, this.dropProgramFragmentSource);
    const updateProgram = (this.updateProgram = this.createProgram(
      this.vertexShader,
      this.updateProgramFragmentSource,
    ));
    gl.uniform2fv(updateProgram.locations!.delta, this.textureDelta);
    this.renderProgram = this.createProgram(
      this.renderVertexSource,
      this.renderProgramFragmentSource,
    );
    gl.uniform2fv(this.renderProgram.locations.delta, this.textureDelta);
  }

  /**
   * ##  增加 WebGLProgram
   * @param vertexSource
   * @param fragmentSource
   * @param _uniformValues
   */
  private createProgram(vertexSource: string, fragmentSource: string, _uniformValues?: string) {
    const { gl } = this;
    const program: Program = {
      id: gl.createProgram(),
      uniforms: {},
      locations: {},
    };
    /**  向 WebGLProgram 添加一个片段  */
    gl.attachShader(program.id, this.compileSource(gl.VERTEX_SHADER, vertexSource));
    /**  向 WebGLProgram 添加一个顶点着色器  */
    gl.attachShader(program.id, this.compileSource(gl.FRAGMENT_SHADER, fragmentSource));
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
     * ## 多次匹配
     * 并在找不到时返回 null
     * 每一次匹配都会更新 lastIndex 的数值
     * 该方法是正则表达式的原始方法，强大而有效，但通常不能表达清楚调用的目的
     */
    while (!isNull((match = regex.exec(shaderCode)))) {
      const name = match[2];
      program.locations[name] = gl.getUniformLocation(program.id, name)!;
    }
    return program;
  }
  /**
   * 编译一个着色器
   * @param type
   * @param source
   */
  private compileSource(type: GLenum, source: string) {
    const { gl } = this;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source); /// 设置 WebGLShader 着色器
    gl.compileShader(shader); /// 编译一个着色器，使其成为二进制数据，然后就可以被 WebGLProgram 对象所使用
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error('compile error: ' + gl.getShaderInfoLog(shader));
    return shader;
  }
  // ++++++++++++++++++++++ 初始化 GL 《〈《〈《〈《 ++++++++++++++++++++++

  /**
   * ## 绑定图片
   * 默认绑定的是 `buildBackground.currentDrawImage`，且不再接受参数，请调用前**保证已设定 `buildBackground.currentDrawImage`**
   */
  bindImage() {
    if (dun) {
      dog.type = false;
    }
    const { gl, buildBackground, elementMeta, backgroundTexture } = this;
    const { currentDrawImage } = buildBackground;
    const { backgroundInfo } = elementMeta;
    const { width, height } = backgroundInfo;

    /**
     *  只有维度为 2 的幂的纹理才能重复换行
     * @param x
     */
    const isPowerOfTwo = (x: number) => isZero(x & (x - 1));
    const wrapping = isPowerOfTwo(width) && isPowerOfTwo(height) ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    // 将给定的 WebGLTexture 绑定到目标（绑定点）
    gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
    /**
     * gl.texParameteri(target: GLenum, pname: GLenum, param: GLenum);
     *
     * - target 指定目标的纹理类型
     *    - gl.TEXTURE_D  二维纹理
     *    - gl.TEXTURE_CUBE_MAP 立方体贴图
     * - pname 设置纹理参数类型
     *     -  gl.TEXTURE_WRAP_S: 水平方向（U轴）的纹理坐标超出 [0,1] 时的处理方式。
     *     -  gl.TEXTURE_WRAP_T: 垂直方向（V轴）的纹理坐标超出 [0,1] 时的处理方式。
     *     -  gl.TEXTURE_MIN_FILTER: 纹理缩小（远距离观察）时的采样滤波方式。
     *     -  gl.TEXTURE_MAG_FILTER: 纹理放大（近距离观察）时的采样滤波方式。
     * - param 参数的具体值，取决于 pname：
     *     -  对于 WRAP_S/WRAP_T：
     *              -   gl.REPEAT：重复纹理（默认值）。
     *              -   gl.CLAMP_TO_EDGE：拉伸边缘像素。
     *              -   gl.MIRRORED_REPEAT：镜像重复纹理。
     *       -   对于 MIN_FILTER/MAG_FILTER：
     *              -   gl.LINEAR：线性插值（平滑过渡）。
     *              -   gl.NEAREST：最近邻采样（保留像素感）。
     *              -   （MIN_FILTER 还支持多级渐远纹理相关选项如 gl.LINEAR_MIPMAP_LINEAR）
     *
     */
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
    if (dun) {
      // dog('即将创建的图像', image);
      dog.type = false;
      dog('本次使用的纹理为', dog.type, currentDrawImage.tag, currentDrawImage.resource);
    }
    /// 指定二维纹理图像
    // parentElement.dataset['render_img'] = textImageSource.tag;
    // parentElement.dataset['render_width'] = textImageSource.width + 'px';
    // parentElement.dataset['render_height'] = textImageSource.height + 'px';

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, currentDrawImage.resource);
    if (dun) {
      dog.type = true;
    }
  }
  /**
   * ## 绘制 GL 数据流
   */
  drawQuad() {
    const { gl } = this.element;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  /**
   * swap 缓冲区索引
   */
  swapBufferIndices() {
    const { bufferWriteIndex, bufferReadIndex } = this;
    this.bufferWriteIndex = 1 - bufferWriteIndex;
    this.bufferReadIndex = 1 - bufferReadIndex;
  }

  /**
   * ## 绑定纹理
   * @param texture
   * @param unit
   */
  bindTexture(texture: WebGLTexture, unit: number = 0) {
    const { gl } = this;
    /**  激活纹理单元  */
    gl.activeTexture(gl.TEXTURE0 + (unit || 0));
    /**  将给定的 WebGLTexture 绑定到目标点  */
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }
}
