import { OriginStyle } from '../type';

/**  获取元素的样式  */
export function getBackgroundStyles(element: HTMLElement): OriginStyle {
  const computedStyle = window.getComputedStyle(element);

  const style = element.style;

  return {
    inlineBackground: style.background,
    inlineBackgroundColor: style.backgroundColor,
    inlineBackgroundImage: style.backgroundImage,
    backgroundColor: computedStyle.backgroundColor,
    backgroundImage: computedStyle.backgroundImage,
    backgroundSize: computedStyle.backgroundSize,
    backgroundPosition: computedStyle.backgroundPosition,
    backgroundRepeat: computedStyle.backgroundRepeat,
    backgroundClip: computedStyle.backgroundClip,
    backgroundOrigin: computedStyle.backgroundOrigin,
    backgroundAttachment: computedStyle.backgroundAttachment,
    position: computedStyle.position,
    width: parseInt(computedStyle.width),
    height: parseInt(computedStyle.height),
  };
}
