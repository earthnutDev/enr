import { isNull } from 'a-type-of-js';
import { Ripples } from '../ripplesClass';
import { computeTextureBoundaries } from './computeTextureBoundaries';
import { draw } from './draw';
import { update } from './update';

/**
 * 开启绘制
 *
 */
export function render(this: Ripples) {
  const { renderData, options, fadeData } = this;
  if (isNull(renderData)) return;
  const { parentElement } = renderData;
  const { isTransitioning } = fadeData;
  const { running, idleFluctuations, lastRunningState } = options;
  {
    // 获取边界尺寸
    const styles = getComputedStyle(parentElement);
    fadeData.backgroundInfo = {
      width: parseInt(styles.width),
      height: parseInt(styles.height),
    };
  }
  ///  计算当前的纹理边界及背景图
  Reflect.apply(computeTextureBoundaries, this, []);
  // 当前状态为执行
  if (running) {
    // 上一次状态为不执行
    if (!lastRunningState) {
      options.lastRunningState = true; // 设置下次执行状态
      this.show(); // 展示背景
    }
    // 是否设置了闲时动画
    if (idleFluctuations) this.raindropsFall();
    /**
     *  TODO  这里调用触发了错误
     *
     *  可能是值  isTransitioning 出现了故障
     *
     *  Cannot read properties of undefined (reading 'resource')
     */
    // 当前绘制图像间转换
    if (isTransitioning) this.fade();
    /**  数据更新  */
    Reflect.apply(update, this, []);
    /**  渲染  */
    Reflect.apply(draw, this, []);
  }
  // 当前状态为未执行但是上一次是在执行（清理状态）
  else if (lastRunningState) {
    options.lastRunningState = false;
    this.hide();
  }
  // 渲染
  renderData.animationFrameId = requestAnimationFrame(() => Reflect.apply(render, this, []));
}
