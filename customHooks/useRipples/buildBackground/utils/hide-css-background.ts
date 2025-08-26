import { dog } from 'dog';
import { Ripples } from '../../ripplesClass';
import { isNull } from 'a-type-of-js';

/**
 * ## 隐藏背景
 *
 * 触发于
 * - 手动恢复背景 webGl 的显示
 * - 初始化时隐藏
 * - 父级样式属性发生变更的时候
 */
export function hideCssBackground(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;
  const { parentElement } = renderData;
  if (!parentElement) return;
  dog('重写父级的行内样式');
  // renderData.dropProgram = [];
  // 检测是否更改了行内样式或是重写了该样式
  [
    // ['background', 'transparent'],
    ['background-image', 'none'],
    ['background-color', 'transparent'],
  ].forEach(e => parentElement.style.setProperty(e[0], e[1], 'important'));
  dog('重写后的父级的行内背景样式', parentElement.style.background);
  dog('重写后的父级的行内背景色样式', parentElement.style.backgroundColor);
  dog('重写后的父级的行内背景图样式', parentElement.style.backgroundImage);
  dog('暂存的原始样式', renderData.originStyle);
  dog('暂存的最后获取样式', renderData.lastUseStyle);
}
