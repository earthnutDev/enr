import { dog } from 'packages/enr/dog';
import { circleDataList } from './circleDataList';

/**  构建默认的背景图  */
export function createDefault(width: number, height: number) {
  dog.type = false;
  dog(`构建默认的纹理尺寸：宽 ${width} 高 ${height}`);
  const time = Date.now();
  dog('开始构建默认的时间', time);
  /**  图像数据  */
  const imageData = new ImageData(width || 1, height || 1);
  /**  数据流  */
  const data = imageData.data;
  // dog(circleDataList);
  const { diameter, list } = circleDataList.data;
  /**  完全的占用的粒子数  */
  const row = width * diameter;
  for (let i = 0; i < data.length; i += 4) {
    /**  当前晶格技位置  */
    const subscript = (i / 4) % row;
    const x = (subscript % width) % diameter;
    const y = Math.floor(subscript / width);
    const ele = list[x][y];
    data[i] = ele[0];
    data[i + 1] = ele[1];
    data[i + 2] = ele[2];
    data[i + 3] = ele[3];
  }
  dog('构建结束的时间', Date.now() - time);
  dog.type = true;
  return imageData;
}
