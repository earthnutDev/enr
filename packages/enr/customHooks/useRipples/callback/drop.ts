import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { bindTexture } from '../tools';
import { drawQuad } from '../render/drawQuad';
import { swapBufferIndices } from '../render/swapBufferIndices';

/**  触发滴落效果  */
export function drop(this: Ripples, x: number, y: number, radius: number, strength: number) {
  const { renderData, options } = this;
  const gl = this.gl;

  if (isNull(renderData)) return;

  const { parentElement, dropProgram, textures, framebuffers, bufferWriteIndex, bufferReadIndex } =
    renderData;
  const { resolution } = options;
  /**  元素的宽  */
  const parentWidth = parentElement.offsetWidth;
  /**  元素的高  */
  const parentHeight = parentElement.offsetHeight;
  /**  元素较长的一边  */
  const longestSide = Math.max(parentWidth, parentHeight);
  radius = radius / longestSide;
  const dropPosition = new Float32Array([
    (2 * x - parentWidth) / longestSide,
    (parentHeight - 2 * y) / longestSide,
  ]);

  gl.viewport(0, 0, resolution, resolution);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[bufferWriteIndex]);
  Reflect.apply(bindTexture, this, [textures[bufferReadIndex]]);
  gl.useProgram(dropProgram.id);
  gl.uniform2fv(dropProgram.locations.center, dropPosition);
  gl.uniform1f(dropProgram.locations.radius, radius);
  gl.uniform1f(dropProgram.locations.strength, strength);
  Reflect.apply(drawQuad, this, []);
  Reflect.apply(swapBufferIndices, this, []);
}
