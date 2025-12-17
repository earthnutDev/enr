/****************************************************************************
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName website
 * @FileName loadConfig.ts
 * @CreateDate  周五  12/13/2024
 * @Description 加载 config
 ****************************************************************************/

import { RipplesData } from './index';

/**
 * 执行的配置数据
 *
 */
export function loadConfig(this: RipplesData) {
  /**  构建失败  */
  const buildFail = () => ((this.initState = false), null);

  if (!this.gl) return buildFail();

  const { gl } = this;

  /**
   * webGL 扩展
   */
  const extensions: { [x: string]: OCULUS_multiview | null } = Object.fromEntries(
    [
      'OES_texture_float',
      'OES_texture_half_float',
      'OES_texture_float_linear',
      'OES_texture_half_float_linear',
    ].reduce((previousValue: [string, OCULUS_multiview | null][], currentName) => {
      const currentExtension = gl.getExtension(currentName);
      if (currentExtension) previousValue.push([currentName, currentExtension]);
      return previousValue;
    }, []),
  );

  /**  如果不支持浮点扩展，我们可以提前退出  */
  if (!extensions.OES_texture_float) return buildFail();

  /**  配置  */
  const configs = [];
  /**
   * 创建配置数据
   */
  function createConfig(type: string, glType: number, arrayType: Float32ArrayConstructor | null) {
    /**   webGL 扩展名  */
    const name = 'OES_texture_' + type;
    /**  webGL 扩展名  */
    const nameLinear = name + '_linear';
    /**  是否支持线性过滤  */
    const linearSupport = nameLinear in extensions;

    return {
      type: glType,
      linearSupport,
      arrayType,
      extensions: linearSupport ? [name, nameLinear] : [name],
    };
  }

  configs.push(createConfig('float', gl.FLOAT, Float32Array));

  if (extensions.OES_texture_half_float) {
    /**
     * 数组类型应该是 Uint16Array，但至少在 iOS 上会中断。在这种情况下，我们
     * 只需使用 data=null 而不是 data=new Uint16Array（...） 初始化纹理即可。
     * 这使得初始化速度稍慢，但仍然可以忽略不计。
     */
    configs.push(
      // eslint-disable-next-line jsdoc/check-tag-names
      /**  @ts-expect-error:  123 */
      createConfig('half_float', extensions.OES_texture_half_float.HALF_FLOAT_OES, null),
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

  return config;
}
