/**  根据给出的 src 获取一个 img 对象  */
export function createImageBySrc(src: string, width: number, height: number) {
  const img = new Image(width, height);
  img.width = width;
  img.height = height;
  img.src = src;
  return img;
}
