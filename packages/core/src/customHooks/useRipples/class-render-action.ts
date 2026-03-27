/**
 * @module @enr/class-render-action
 * @file class-render-action.ts
 * @description 渲染动作类
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-22 12:07
 * @version 2.0.0-alpha.0
 * @lastModified 2026-03-27 11:42
 */

import { isBusinessEmptyString, isEmptyArray, isNull, isUndefined, isZero } from 'a-type-of-js';
import { dog, dun } from 'zza/log';
import type { BuildBackground } from './class-build-background';
import type { ElementEnvironment } from './class-element-environment';
import type { ElementMeta } from './class-html-element-meta';
import type { RippleParam } from './class-param';
import type { RenderData } from './class-render-data';
import type { RippleGl } from './class-webgl';
import {
  isNoneBackGroundColor,
  isNoneBackgroundImage,
  isPercentage,
  translateBackgroundPosition,
} from './tools';
import type { DrawImage } from './types';

/**
 * ## 渲染执行类
 */
export class RenderAction {
  /**
   *
   * @param element 元素相关数据
   * @param options 用户设定参数
   * @param elementMeta canvas 元素等相关数据
   * @param renderData 渲染数据
   * @param buildBackground 构建默认的样式
   * @param rippleGl WebGl 支持
   */
  constructor(
    private readonly element: ElementEnvironment,
    private readonly options: RippleParam,
    private readonly elementMeta: ElementMeta,
    private readonly renderData: RenderData,
    private readonly buildBackground: BuildBackground,
    private readonly rippleGl: RippleGl,
  ) {}

  /**
   * ## 设置缓变
   * 缓变分两种，一种是没有任何设置的缓变；另一种就是两个不同类型之间的缓变
   *
   * **注意** ： 该方法不直接调用 {@link fade()} ，而是通过执行 `renderData.run()` 更新状态，在 `beginWork()` 中开启的执行
   */
  runSide() {
    const { options, renderData, buildBackground } = this;
    if (isUndefined(renderData)) return; // 防空
    if (renderData.transparentId) clearTimeout(renderData.transparentId); // 清理栈中未执行的同类型调用，防止多次触发
    /// 设置下一个循环
    renderData.transparentId = setTimeout(
      () => {
        if (dun) {
          dog.type = true;
        }
        clearTimeout(renderData.transparentId); // 清理栈中未执行的同类型调用，防止 多次触发
        if (dun) {
          dog('当前执行的列表', buildBackground.toBeList);
        }
        // 这里之前判定有误，因为 `buildBackground.toBeList` 一直存在
        // 且当前逻辑 `renderData` 也一定存在
        if (!renderData || !buildBackground.toBeList) {
          if (dun) {
            dog.warn('执行列表为空，直接退出');
          }
          return; // 防空
        }
        // 当前上一次为执行完毕放弃本次子执行，创建下一次执行
        if (renderData.isTransitioning) return this.runSide();
        if (dun) {
          // 校验当前是否可执行
          dog('当前执行的 id', renderData.transparentId);
          dog('当前执行的项', buildBackground.lastDrawImage);
          dog('尚有未执行的项', buildBackground.toBeList.length);
        }

        // 执行环境相同退出循环
        if (this.buildBackground.forbiddenRunSide()) {
          if (dun) {
            dog('当前禁止执行循环，退出循环', this.buildBackground.lastDrawImage);
          }
          return;
        }
        renderData.run();
        if (dun) {
          dog('开始渐变');
          dog.type = true;
        }
      }, // 触发渐变
      options.raindropsTimeInterval * 2,
    );
  }

  /**
   * ## 两个图像间的淡入淡出
   *
   * 因为第一个背景图出现的总是那么的突兀。现在对第一个渐变判定并单独处理
   */
  fade() {
    const { renderData, buildBackground, options } = this;
    const { toBeList } = buildBackground;

    if (isEmptyArray(toBeList)) {
      return this.exitFade('由于缺少当前渲染背景，退出');
    }

    if (renderData.currentProgress === 0) {
      if (dun) {
        dog('开始执行渐变，当前尚有可执行', toBeList.length);
        toBeList.forEach((e, i) => dog(`待执行 ${i} ： `, e));
      }
      // TODO
    }
    if (dun) {
      dog('当前执行的进度，', renderData.currentProgress);
    }
    // 进度完成则结束当前的进度
    if (renderData.isEnd()) {
      this.fadeEnd();
      return; // 结束当前的渐变
    }

    renderData.dPAdd();
    if (dun) {
      // dog('当前的渲染进度', fadeData.drawProgress, fadeData.lastDrawImage);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    /**
     *  bug: 2508021258（2）
     *
     *  这里判定了当前的执行环境并退出了执行，但是并没有设定 `isTransitioning` 值
     *
     */
    if (isNull(ctx) || isNull(buildBackground.lastDrawImage.resource) || isEmptyArray(toBeList)) {
      if (dun) {
        dog(
          '是我啦',
          isNull(ctx),
          '-',
          isNull(buildBackground.lastDrawImage.resource),
          '-',
          isEmptyArray(toBeList),
        );
      }
      return this.exitFade('环境值错误');
    }
    const { width, height } = this.elementMeta.backgroundInfo;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    // ctx.globalCompositeOperation = 'destination-over';
    {
      // ctx.globalAlpha = 1 - drawProgress;
      ctx.drawImage(this.buildBackground.lastDrawImage.resource, 0, 0, width, height); // 绘制上一次的图案
      ctx.globalAlpha = renderData.currentTransparency; // 设置透明度
      /**
       * bug: 2508021258（1）
       *
       * TODO 这里 报错
       *
       * Cannot read properties of undefined (reading 'resource')
       *
       *
       * 报错说这里没有数据，在复现的 bug 数据中，数组第一位为 undefined，而 2、3 位有真实数据
       *
       * 确认该错误是由于在判定 `fadeData.isTransitioning` 为 `true` 造成的第一个待执行项不存在却被设置为新的数组的第一项
       *
       */
      ctx.drawImage(toBeList[0].resource, 0, 0, width, height);
    }

    ctx.globalAlpha = 1;
    /**  当前渲染项  */
    const currentDrawImage: DrawImage = {
      resource: canvas,
      width,
      height,
      kind: 'mix',
      tag: `${buildBackground.lastDrawImage.tag} >> ${toBeList[0].tag}`,
      isDark: this.elementMeta.isDark,
    };
    buildBackground.currentDrawImage = currentDrawImage;
    // 渲染渐变过程中的纹理
    this.rippleGl.bindImage();
    // 当前执行的列表中有两个（两个以上的可能性比较小）
    if (toBeList.length > 1) {
      buildBackground.lastDrawImage = currentDrawImage;
      toBeList.shift(); // 直接丢弃第一个
      renderData.resetDP();
    }
  }

  /** 渐变结束 */
  private fadeEnd() {
    const { buildBackground, options } = this;
    const { toBeList } = buildBackground;
    this.options.firstRun = false; // 已经经历过一次渐变，之后不再缓慢渐变
    buildBackground.lastDrawImage = toBeList.shift()!; // 更新最后渲染的纹理图
    if (dun) {
      dog('执行渐变背景完毕，剩余可执行', toBeList);
    }
    this.rippleGl.bindImage(); // 渲染到背景图
    // 尚有未执行完毕的
    if (isEmptyArray(toBeList)) {
      const { lastUseStyle } = this.elementMeta;
      // 没有设置背景色或是背景图
      if (
        (isNull(options.imgUrl) ||
          isBusinessEmptyString(options.imgUrl) ||
          isZero(options.imgUrl.length)) &&
        isNoneBackGroundColor(lastUseStyle.backgroundColor) &&
        isNoneBackgroundImage(lastUseStyle.backgroundImage)
      ) {
        // 因为此时渲染为空，需要手动添加一个默认渲染
        buildBackground.setTransparentTexture(false); // 是否 false，将下次循环执行权交回 `runFade()` 方法
      }
    }
    // 启用下一轮的循环
    return this.exitFade('当前执行完毕，开启下次执行');
  }

  /**
   *  退出当前的渐变执行
   * @param message
   */
  private exitFade(message: string) {
    if (dun) {
      dog.type = true;
    }
    const { renderData } = this;
    renderData.isTransitioning = false;
    if (dun) {
      dog(message);
    }
    this.runSide();
  }

  /**  计算纹理边界及背景图  */
  computeTextureBoundaries() {
    if (dun) {
      dog.type = false;
    }
    const { rippleGl, element, elementMeta } = this;

    const { parentNode } = element;
    /**  获取的父级元素的样式  */
    const style = globalThis?.getComputedStyle(parentNode);
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
      // const parentRect = parentNode.getBoundingClientRect();
      container.left = 0;
      container.top = 0;
      container.width = parentNode.scrollWidth;
      container.height = parentNode.scrollHeight;
    }

    // TODO: background-clip
    /**  背景图的宽度  */
    let backgroundWidth: string | number;
    /**  背景图的高度  */
    let backgroundHeight: string | number;

    const { width, height } = elementMeta.backgroundInfo || { width: 100, height: 100 };
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

    if (dun) {
      dog('计算得到的背景的尺寸的值', backgroundWidth, backgroundHeight, backgroundX, backgroundY);
    }

    /**  计算在 WebGL 着色器中使用的纹理坐标 （UV 坐标）的起点（左上角位置）   */
    rippleGl.renderProgram.uniforms.topLeft = new Float32Array([
      -Number(backgroundX) / backgroundWidth,
      -Number(backgroundY) / backgroundHeight,
    ]);
    // renderData.renderProgram.uniforms.topLeft = new Float32Array([
    //   (parentNode.offsetLeft - Number(backgroundX)) / backgroundWidth,
    //   (parentNode.offsetTop - Number(backgroundY)) / backgroundHeight,
    // ]);
    if (dun) {
      dog('父级元素的偏移', parentNode.offsetLeft, parentNode.offsetTop);
    }
    /**    */
    rippleGl.renderProgram.uniforms.bottomRight = new Float32Array([
      rippleGl.renderProgram.uniforms.topLeft[0] + parentNode.clientWidth / backgroundWidth,
      rippleGl.renderProgram.uniforms.topLeft[1] + parentNode.clientHeight / backgroundHeight,
    ]);
    /**  canvas 中较大的边  */
    const maxSide: number = Math.max(element.canvas.width, element.canvas.height);

    rippleGl.renderProgram.uniforms.containerRatio = new Float32Array([
      element.canvas.width / maxSide,
      element.canvas.height / maxSide,
    ]);
    if (dun) {
      dog.type = true;
    }
  }

  /**
   * ## 绘制
   */
  draw() {
    /**  渲染数据  */
    const { element, options, rippleGl } = this;
    const { gl } = rippleGl;
    const { canvas: canvasNode } = element;

    /** 扰动系数 */
    const { textures, backgroundTexture } = rippleGl;
    const { perturbation } = options;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvasNode.width, canvasNode.height);
    gl.enable(gl.BLEND);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // 全量清理
    gl.useProgram(rippleGl.renderProgram.id);

    rippleGl.bindTexture(backgroundTexture, 0);
    rippleGl.bindTexture(textures[0], 1);
    gl.uniform1f(rippleGl.renderProgram.locations.perturbation, perturbation);
    gl.uniform2fv(
      rippleGl.renderProgram.locations.topLeft,
      rippleGl.renderProgram.uniforms.topLeft,
    );
    gl.uniform2fv(
      rippleGl.renderProgram.locations.bottomRight,
      rippleGl.renderProgram.uniforms.bottomRight,
    );
    gl.uniform2fv(
      rippleGl.renderProgram.locations.containerRatio,
      rippleGl.renderProgram.uniforms.containerRatio,
    );
    gl.uniform1i(rippleGl.renderProgram.locations.samplerBackground, 0);
    gl.uniform1i(rippleGl.renderProgram.locations.samplerRipples, 1);
    rippleGl.drawQuad();
    gl.disable(gl.BLEND);
  }
  /**
   * ## 更新数据
   */
  update() {
    const { element, options, rippleGl } = this;
    const { updateProgram, textures, framebuffers, bufferWriteIndex, bufferReadIndex } = rippleGl;
    const { gl } = element;
    const { resolution } = options;
    /** 视口设定。官网指出在 canvas 的尺寸变化时需要告知视口  */
    gl.viewport(0, 0, resolution, resolution);
    /**  将给定的 WebGLFramebuffer 绑定到目标
     * - gl.FRAMEBUFFER 收集永远渲染的颜色
     * - this.Framebuffers
     */
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[bufferWriteIndex]);
    rippleGl.bindTexture(textures[bufferReadIndex]);
    /**  将定义好的 WebGLProgram 对象添加到当前的渲染状态中  */
    gl.useProgram(updateProgram.id!);
    rippleGl.drawQuad();
    rippleGl.swapBufferIndices();
  }
}
