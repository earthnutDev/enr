import { isNull } from 'a-type-of-js';
import {
  dropProgramFragmentSource,
  renderProgramFragmentSource,
  renderVertexSource,
  updateProgramFragmentSource,
  vertexShader,
} from '../rippersData/vertexSource';
import { Ripples } from '../ripplesClass';
import { createProgram } from '../tools';
/**
 *
 * 初始化着色器
 *
 */
export function initShaders(this: Ripples) {
  const gl = this.gl;
  const { renderData } = this;
  if (isNull(renderData)) return;

  const { textureDelta } = renderData;
  renderData.dropProgram = createProgram(vertexShader, dropProgramFragmentSource, gl);
  const updateProgram = (renderData.updateProgram = createProgram(
    vertexShader,
    updateProgramFragmentSource,
    this.gl!,
  ));
  gl.uniform2fv(updateProgram.locations!.delta, textureDelta);
  renderData.renderProgram = createProgram(renderVertexSource, renderProgramFragmentSource, gl);
  gl.uniform2fv(renderData.renderProgram.locations.delta, textureDelta);
}
