import { isNull, isZero } from 'a-type-of-js';
import { Ripples } from '../../ripplesClass';

import { DrawImage } from '../../rippersData/fadeData';
import { dog } from 'dog';

/**  绑定图片  */
export function bindImage(this: Ripples, textImageSource: DrawImage) {
  dog.type = true;
  const { gl, renderData, fadeData } = this;

  if (isNull(renderData)) {
    dog('绑定纹理未找到渲染数据');
    return;
  }

  const { backgroundTexture } = renderData;
  const { backgroundInfo } = fadeData;
  const { width, height } = backgroundInfo;

  /**  只有维度为 2 的幂的纹理才能重复换行  */
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
  // dog('即将创建的图像', image);
  /// 指定二维纹理图像
  dog('本次使用的纹理为', textImageSource.tag, textImageSource.resource);

  // parentElement.dataset['render_img'] = textImageSource.tag;
  // parentElement.dataset['render_width'] = textImageSource.width + 'px';
  // parentElement.dataset['render_height'] = textImageSource.height + 'px';

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textImageSource.resource);
  dog.type = true;
}
