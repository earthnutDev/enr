import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { dog } from 'dog';

/**  计算纹理边界及背景图  */
export function computeTextureBoundaries(this: Ripples) {
  dog.type = false;
  const { renderData, fadeData } = this;
  if (isNull(renderData)) return;

  const { parentElement } = renderData;
  /**  获取的父级元素的样式  */
  const style = window.getComputedStyle(parentElement);
  /** 父元素样式 background-size 的值 */
  const {
    backgroundSize,
    backgroundAttachment,
    backgroundPosition: parentBackgroundPosition,
  } = style;
  /** 父元素样式 background-position 的值  */
  const backgroundPosition = translateBackgroundPosition(parentBackgroundPosition);
  // 这里的 'container' 是背景适应的元素（Chrome 窗口或某些元素，具体取决于附件）
  const container = { left: 0, top: 0, width: 0, height: 0 };

  if (backgroundAttachment === 'fixed') {
    container.height = window.innerHeight;
    container.left = window.screenX;
    container.top = window.screenY;
    container.width = window.innerWidth;
  } else {
    // const parentRect = parentElement.getBoundingClientRect();
    container.left = 0;
    container.top = 0;
    container.width = parentElement.scrollWidth;
    container.height = parentElement.scrollHeight;
  }

  // TODO: background-clip
  /**  背景图的宽度  */
  let backgroundWidth: string | number;
  /**  背景图的高度  */
  let backgroundHeight: string | number;

  const { width, height } = fadeData.backgroundInfo || { width: 100, height: 100 };
  /**  背景图的尺寸  */
  if (backgroundSize === 'cover') {
    const scale = Math.max(container.width / width, container.height / height);
    backgroundWidth = width * scale;
    backgroundHeight = height * scale;
  } else if (backgroundSize === 'contain') {
    const scale = Math.min(container.width / width, container.height / height);
    backgroundWidth = width * scale;
    backgroundHeight = height * scale;
  } else {
    const _backgroundSize = backgroundSize.split(' ');
    backgroundWidth = _backgroundSize[0] || '';
    backgroundHeight = _backgroundSize[1] || backgroundWidth;

    if (isPercentage(backgroundWidth)) {
      backgroundWidth = (container.width * parseFloat(backgroundWidth)) / 100;
    } else if (backgroundWidth !== 'auto') {
      backgroundWidth = parseFloat(backgroundWidth);
    }

    if (isPercentage(backgroundHeight)) {
      backgroundHeight = (container.height * parseFloat(backgroundHeight)) / 100;
    } else if (backgroundHeight !== 'auto') {
      backgroundHeight = parseFloat(backgroundHeight);
    }

    if (backgroundWidth === 'auto' && backgroundHeight === 'auto') {
      backgroundWidth = width;
      backgroundHeight = height;
    } else {
      if (backgroundWidth === 'auto') {
        backgroundWidth = width * (Number(backgroundHeight) / height);
      }

      if (backgroundHeight === 'auto') {
        backgroundHeight = height * (Number(backgroundWidth) / width);
      }
    }
  }

  // 计算 backgroundX 及 backgroundY 在的值
  /**  计算背景的渲染横轴位置  */
  let backgroundX = (backgroundPosition && backgroundPosition[0]) || '0%';
  /**  计算背景的渲染纵轴位置  */
  let backgroundY = (backgroundPosition && backgroundPosition[1]) || '0%';

  if (isPercentage(backgroundX)) {
    backgroundX = (
      container.left +
      ((container.width - Number(backgroundWidth)) * parseFloat(backgroundX)) / 100
    ).toString();
  } else {
    backgroundX = (container.left + parseFloat(backgroundX)).toString();
  }

  if (isPercentage(backgroundY)) {
    backgroundY = (
      container.top +
      ((container.height - Number(backgroundHeight)) * parseFloat(backgroundY)) / 100
    ).toString();
  } else {
    backgroundY = (container.top + parseFloat(backgroundY)).toString();
  }

  dog('计算得到的背景的尺寸的值', backgroundWidth, backgroundHeight, backgroundX, backgroundY);

  /**  计算在 WebGL 着色器中使用的纹理坐标 （UV 坐标）的起点（左上角位置）   */
  renderData.renderProgram.uniforms.topLeft = new Float32Array([
    -Number(backgroundX) / backgroundWidth,
    -Number(backgroundY) / backgroundHeight,
  ]);
  // renderData.renderProgram.uniforms.topLeft = new Float32Array([
  //   (parentElement.offsetLeft - Number(backgroundX)) / backgroundWidth,
  //   (parentElement.offsetTop - Number(backgroundY)) / backgroundHeight,
  // ]);
  dog('父级元素的偏移', parentElement.offsetLeft, parentElement.offsetTop);
  /**    */
  renderData.renderProgram.uniforms.bottomRight = new Float32Array([
    renderData.renderProgram.uniforms.topLeft[0] + parentElement.clientWidth / backgroundWidth,
    renderData.renderProgram.uniforms.topLeft[1] + parentElement.clientHeight / backgroundHeight,
  ]);
  /**  canvas 中较大的边  */
  const maxSide: number = Math.max(this.canvas.width, this.canvas.height);

  renderData.renderProgram.uniforms.containerRatio = new Float32Array([
    this.canvas.width / maxSide,
    this.canvas.height / maxSide,
  ]);
  dog.type = true;
}
/**
 *
 * 转换背景的位置为特定的格式
 *
 */
function translateBackgroundPosition(value: string): string[] {
  if (/\s+/.test(value)) {
    return value
      .replace(/center/, '50%')
      .replace(/top|left/, '0%')
      .replace(/bottom/, '100%')
      .replace(/\s+/, ' ')
      .split(' ');
  } else if (isPercentage(value)) {
    return [value, '50%'];
  } else {
    return {
      center: ['50%', '50%'],
      top: ['50%', '0%'],
      bottom: ['50%', '100%'],
      left: ['0%', '50%'],
      right: ['100%', '50%'],
    }[value as 'center' | 'top' | 'bottom' | 'left' | 'right'];
  }
}
/**
 *
 * 给定的字符串是否为百分数
 *
 */
function isPercentage(value: string) {
  return value.endsWith('%');
}
