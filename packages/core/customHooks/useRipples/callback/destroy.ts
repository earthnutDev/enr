import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { dog } from 'packages/enr/dog';

/**  注销  */
export function destroy(this: Ripples) {
  const { renderData, fadeData } = this;
  dog('执行销毁');

  if (!isNull(renderData)) {
    dog('销毁 render 数据');
    renderData.destroy();
    /// 销毁执行上下文本身
    Object.keys(renderData).forEach(e => (renderData[e as never] = null as never));
    this.renderData = null as never;
  }

  {
    dog('销毁 fade 数据');
    fadeData.destroy();
    Object.keys(fadeData).forEach(e => (fadeData[e as never] = null as never));
    this.fadeData = null as never;
  }
  {
    /// 销毁当前对  WebGLRenderingContext 的引用
    if (this.gl) this.gl = null as unknown as never;
  }
}
