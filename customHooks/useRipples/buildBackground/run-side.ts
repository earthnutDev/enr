import { dog } from 'dog';
import { forbiddenRunSide } from '../callback/can-side';
import { Ripples } from '../ripplesClass';
import { isUndefined } from 'a-type-of-js';

/**
 * 设置缓变
 *
 * 缓变分两种，一种是没有任何设置的缓变；另一种就是两个不同类型之间的缓变
 *
 *
 */
export function runSide(this: Ripples) {
  const { options, fadeData } = this;

  if (isUndefined(fadeData)) return; // 防空

  /// 设置下一个循环
  fadeData.transparentId = setTimeout(
    () => {
      clearTimeout(fadeData.transparentId); // 清理栈中未执行的同类型调用，防止多次触发
      if (!fadeData || !fadeData.toBeList) return; // 防空
      // 当前上一次为执行完毕放弃本次子执行，创建下一次执行
      if (fadeData.isTransitioning) return Reflect.apply(runSide, this, []);
      // 校验当前是否可执行
      dog('当前执行的 id', fadeData.transparentId);
      dog('当前执行的项', fadeData.lastDrawImage);
      dog('尚有未执行的项', fadeData.toBeList.length);

      // 执行为图片且执行环境相同
      if (Reflect.apply(forbiddenRunSide, this, [])) {
        dog('当前禁止执行循环，退出循环', fadeData.lastDrawImage);
        return;
      }

      fadeData.run();

      dog('开始渐变');
    }, // 触发渐变
    options.raindropsTimeInterval * 2,
  );
}
