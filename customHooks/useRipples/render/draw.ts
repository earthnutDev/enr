import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { bindTexture } from '../tools';
import { drawQuad } from './drawQuad';

/**
 *
 * 绘制
 *
 */
export function draw(this: Ripples) {
  const gl = this.gl;
  /**  渲染数据  */
  const { renderData, options } = this;
  if (isNull(renderData)) return;

  /** 扰动系数 */
  const { textures, backgroundTexture } = renderData;
  const { perturbance } = options;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  gl.enable(gl.BLEND);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 全量清理
  gl.useProgram(renderData.renderProgram.id);

  Reflect.apply(bindTexture, this, [backgroundTexture, 0]);
  Reflect.apply(bindTexture, this, [textures[0], 1]);

  gl.uniform1f(renderData.renderProgram.locations.perturbance, perturbance);
  gl.uniform2fv(
    renderData.renderProgram.locations.topLeft,
    renderData.renderProgram.uniforms.topLeft,
  );
  gl.uniform2fv(
    renderData.renderProgram.locations.bottomRight,
    renderData.renderProgram.uniforms.bottomRight,
  );
  gl.uniform2fv(
    renderData.renderProgram.locations.containerRatio,
    renderData.renderProgram.uniforms.containerRatio,
  );
  gl.uniform1i(renderData.renderProgram.locations.samplerBackground, 0);
  gl.uniform1i(renderData.renderProgram.locations.samplerRipples, 1);
  Reflect.apply(drawQuad, this, []);
  gl.disable(gl.BLEND);
}
