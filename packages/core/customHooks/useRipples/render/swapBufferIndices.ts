import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';

/**
 * swap 缓冲区索引
 */
export function swapBufferIndices(this: Ripples) {
  const { renderData } = this;

  if (isNull(renderData)) return;

  const { bufferWriteIndex, bufferReadIndex } = renderData;
  renderData.bufferWriteIndex = 1 - bufferWriteIndex;
  renderData.bufferReadIndex = 1 - bufferReadIndex;
}
