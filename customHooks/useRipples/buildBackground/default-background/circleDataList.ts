import { getRandomInt } from 'a-js-tools';
import { dog } from 'dog';

const build = (times: number = 0, darkMode: boolean = false) => {
  dog.type = false;
  /**  构建数据  */
  const data: {
    /**  数据  */
    list: [number, number, number, number][][];
    /**  直径  */
    diameter: number;
    /**  半径  */
    radius: number;
    /**  晶格数  */
    cells: number;
  } = {
    list: [],
    diameter: 48,
    radius: 0,
    cells: 0,
  };
  // 防止为单
  if (data.diameter % 2 !== 0) data.diameter++;
  /**  宽  */
  const { diameter: d, list: l } = data;
  /**  半宽  */
  const r = d / 2;
  data.radius = r;
  data.cells = d ** 2;
  for (let x = 0; x < d; x++) {
    l[x] = [];
    for (let y = 0; y < d; y++) l[x][y] = [0, 0, 0, 0];
  }
  dog('当前渲染基础晶格，暗夜模式为：', darkMode);
  // 绘制 1 / 8
  for (let x = 0; x <= r; x++) {
    for (let y = x; y <= r; y++) {
      /**  子项数据  */
      const column: [number, number, number, number] = l[x][y];
      /**  当前是否为圈内  */
      const isInCircle = Math.ceil(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) <= r;
      /**  色值范围开始  */
      const colorStart = darkMode ? 10 : 255;
      /**  色值范围结束  */
      const colorEnd = darkMode ? 25 : 180;
      /**   透明度范围的开始  */
      const opacityStart = isInCircle ? (darkMode ? 160 : 120) : darkMode ? 160 : 180;
      /**  透明度范围开始  */
      const opacityEnd = isInCircle ? (darkMode ? 230 : 160) : darkMode ? 250 : 240;
      const noise = () => getRandomInt(colorStart, colorEnd);
      column[0] = noise(); // R
      column[1] = noise(); // G
      column[2] = noise(); // B
      /**  小于半宽则为圆内 */
      column[3] = getRandomInt(opacityStart, opacityEnd);
    }
  }
  // 绘制 1 / 8
  for (let x = 0; x <= r; x++) for (let y = 0; y <= x; y++) l[x][y] = l[y][x];
  // 绘制为右上半圆
  for (let x = r; x < d; x++) for (let y = 0; y <= r; y++) l[x][y] = l[d - x][y];
  // 绘制左下为 3 / 4 圆
  for (let x = 0; x < r; x++) for (let y = r; y < d; y++) l[x][y] = l[x][d - y];
  // 绘制右下为全圆
  for (let x = r; x < d; x++) for (let y = r; y < d; y++) l[x][y] = l[x][d - y];
  const k = times % d; // 偏移值，让图有动感
  data.list = [...l.slice(k), ...l.slice(0, k)];
  dog.type = true;
  return data;
};

/**  圆数据  */
export const circleDataList = new (class {
  /**  计数器  */
  #cum: number = 1;
  /**  构建新的数据依据  */
  build(darkMode: boolean) {
    if (this.#cum > 100) this.#cum = 0;
    this.data = build(this.#cum++, darkMode);
  }
  /**  数据依据  */
  data = build();
})();
