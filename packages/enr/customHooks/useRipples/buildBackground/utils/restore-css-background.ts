import { isNull } from 'a-type-of-js';
import { Ripples } from '../../ripplesClass';

/**
 * 恢复背景样式
 *
 * 在使用过程中，可能会切换 webGL 的显隐状态，而手动处理背景的更替
 */
export function restoreCssBackground(this: Ripples) {
  const { renderData } = this;
  if (isNull(renderData)) return;

  const { parentElement, originStyle } = renderData;
  // parentElement.style.setProperty('background', originStyle.inlineBackground);
  parentElement.style.setProperty('background-image', originStyle.inlineBackgroundImage);
  parentElement.style.setProperty('background-color', originStyle.inlineBackgroundColor);
}
