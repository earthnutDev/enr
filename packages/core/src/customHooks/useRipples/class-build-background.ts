/**
 * @packageDocumentation
 * @module @enr/class-build-background
 * @file class-build-background.ts
 * @description 构建默认的页面
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-22 14:17
 * @version 2.0.0-alpha.0
 * @lastModified 2026-02-05 17:41
 */

import { getRandomInt, getRandomString } from 'a-js-tools';
import { isArray, isEmptyArray, isNull, isString } from 'a-type-of-js';
import { dog, dun } from 'zza/log';
import type { ElementMeta } from './class-html-element-meta';
import type { RippleParam } from './class-param';
import type { RenderData } from './class-render-data';
import { createImageBySrc, extractUrl, isNoneBackGroundColor } from './tools';
import type { DrawImage } from './types';

/**
 * ## 构建背景
 *
 * 触发构建：
 *
 * - 通过 {@link setImage()}   方法重新尝试加载图片
 *    - 父级尺寸发生变化时
 *    - 用户设定级别 `imgUrl` 发生变化时（在协调类中订阅）
 *    - 初始化 GL 数据时
 * - 通过 {@link setTransparentTexture()} 方法加载默认背景
 *    - 加载背景色有误时
 *    - 执行渐变后（绘制进度超过 1000 ）检验无下一个背景时
 *    - 用户设置级别 `darkMode` 发生变化时（订阅消息时）
 *
 */
export class BuildBackground {
  /**
   * ## 默认加载的首个背景色
   */
  private get defaultColor(): string {
    return this.options.loadingBackgroundColor[Number(this.elementMeta.isDark)];
  }
  /**
   * ## 最后使用
   * 如果没有 toBeList 为空值，则当前渲染的为此纹理）绘制的图像
   */
  lastDrawImage: DrawImage;
  /**  */
  currentDrawImage: DrawImage;
  /**
   * ## 将渲染的绘制图像列表
   * 该值仅出现在需要渐变过程中，一旦渐变完成，实际渲染的值就成了最后渲染的值
   */
  readonly toBeList: DrawImage[] = [];
  /** 默认背景的计数器 */
  private defaultBackgroundCount: number = 1;
  /** 默认背景数据的圆数据 */
  private defaultBackgroundData: {
    list: [number, number, number, number][][];
    diameter: number;
    radius: number;
    cells: number;
  };

  /** 构建默认的使用的数据 */
  private circleData: {
    data: {
      /**  数据  */
      list: [number, number, number, number][][];
      /**  直径  */
      diameter: number;
      /**  半径  */
      radius: number;
      /**  晶格数  */
      cells: number;
    };
  } = {
    data: {
      list: [],
      diameter: 48,
      radius: 0,
      cells: 0,
    },
  };

  /**
   * ## 背景构建
   * @param options 用户设定参数
   * @param elementMeta canvas 数据
   * @param renderData 渲染使用数据
   */
  constructor(
    private readonly options: RippleParam,
    private readonly elementMeta: ElementMeta,
    private readonly renderData: RenderData,
  ) {
    this.defaultBackgroundData = this.buildCircleData();
    /**
     * ## 最后使用的渲染项
     * ~这里其实是第一次渲染的项，但由于该项是直接贴上去的，所以，现在要做一些修整。~
     * ~让第一张背景渲染不那么突兀~
     *
     */
    this.currentDrawImage = this.lastDrawImage = this.createTransparentTexture('first-run');
  }

  /**
   * ##构建默认背景的圆数据
   *
   * - 初始化时默认构建此数据（初始化时不是通过 {@link setTransparentTexture()} 构建，需手动配置。 TODO： 那么问题来了，为什么不通过 setTransparentTexture 构建呢？）
   * - 每次构建新的默认背景图前构建该数据
   */
  private buildCircleData() {
    if (this.defaultBackgroundCount > 100) this.defaultBackgroundCount = 0; // 计数器无意义
    this.defaultBackgroundCount++; // 更新计数器
    if (dun) {
      dog.type = true;
    }
    const { isDark: darkMode } = this.elementMeta;
    /**  构建数据  */
    const data = {
      ...this.circleData.data,
      list: [...this.circleData.data.list],
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
    if (dun) {
      dog('当前渲染基础晶格，暗夜模式为：', darkMode);
    }
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
    const k = this.defaultBackgroundCount % d; // 偏移值，让图有动感
    data.list = [...l.slice(k), ...l.slice(0, k)];
    if (dun) {
      dog.type = true;
    }
    this.defaultBackgroundData = data; // 在非初始化时直接赋值
    return data;
  }

  /**
   * ## 设置透明的纹理
   *
   * 透明的纹理*默认会自动切换*
   *
   * @param [executeImmediately=true]  立即执行
   *
   * 触发时机
   *
   *    - 加载背景色有误时
   *    - 执行渐变后（绘制进度超过 1000 ）检验无下一个背景时
   *    - 用户设置级别 `darkMode` 发生变化时（订阅消息时）
   */
  setTransparentTexture(executeImmediately: boolean = true) {
    if (dun) {
      dog('当前触发设置默认背景', executeImmediately);
    }
    const { renderData } = this;
    const { backgroundInfo } = this.elementMeta;
    const { width, height } = backgroundInfo;
    const tag = getRandomString({
      length: 8,
      includeNumbers: true,
      includeUppercaseLetters: true,
    });
    this.buildCircleData(); // 重要：构建新的 48 位像素图
    if (dun) {
      dog('添加默认纹理', tag);
    }
    //   当前渲染的纹理（下一个）
    this.toBeList.push({
      resource: this.createCanvasElementBySize(),
      width,
      height,
      kind: 'default',
      tag,
      isDark: this.elementMeta.isDark,
    });

    if (executeImmediately) renderData.run(); // 立即执行渐变
  }

  /**
   * ## 通过尺寸创建一个默认图
   *
   * 默认图像是含 {@linkplain createDefault()} 构建的 48 像素拼图
   *
   * **由于历史原因**： 该方法名携带了 `BySize` ，但是移除了尺寸参数
   */
  private createCanvasElementBySize() {
    const { elementMeta } = this;
    const { width, height } = elementMeta.backgroundInfo;
    if (dun) {
      dog('本次构建的宽度为', width, '高度为', height);
    }
    /**  构建空的 canvas  */
    const canvas = document.createElement('canvas');
    const canvasR = document.createElement('canvas');
    /**  执行上下文  */
    const ctx = canvas.getContext('2d');
    const ctxR = canvasR.getContext('2d');
    if (isNull(ctx) || isNull(ctxR)) {
      return canvas;
    }
    canvas.width = canvasR.width = width || 1;
    canvas.height = canvasR.height = height || 1;
    ctx.clearRect(0, 0, width, height); // 清理画布
    ctxR.clearRect(0, 0, width, height);
    ctx.globalAlpha = 1;
    ctx.putImageData(this.createDefault(width, height), 0, 0); // 实际绘制的图
    // TODO： 初始化背景色，这里考虑是否不设定
    // 在暗黑模式下，上一版本默认会初始化为一个大白透明背景，然后转黑，影响用户使用体验
    // ctxR.fillStyle = canvasContext.isDark ? '#44444' : '#999999';
    /**
     * 这个背景色是为了防止 canvas 设定镂空时漏色用的
     * 该色直接影响到渲染实际效果
     * 这里在设置为 '#fff' 并不受
     */
    ctxR.fillStyle = '#ffffff';
    ctxR.fillRect(0, 0, width, height);
    // ctxR.globalCompositeOperation = 'copy';
    ctxR.drawImage(canvas, 0, 0, width || 1, height || 1);
    ctxR.globalCompositeOperation = 'source-over';
    return canvasR;
  }

  /**
   * ##  构建默认的背景图
   *
   * 把构建的位图进行放大到元素的宽和高
   *
   * @param width 元素的宽
   * @param height 元素的高
   */
  private createDefault(width: number, height: number) {
    if (dun) {
      dog.type = false;
      dog(`构建默认的纹理尺寸：宽 ${width} 高 ${height}`);
    }
    const time = Date.now();
    if (dun) {
      dog('开始构建默认的时间', time);
    }
    /**  图像数据  */
    const imageData = new ImageData(width || 1, height || 1);
    /**  数据流  */
    const data = imageData.data;
    const { diameter, list } = this.defaultBackgroundData;
    /**  完全的占用的粒子数  */
    const row = width * diameter;
    for (let i = 0; i < data.length; i += 4) {
      /**  当前晶格及位置  */
      const subscript = (i / 4) % row;
      const x = (subscript % width) % diameter;
      const y = Math.floor(subscript / width);
      const ele = list[x][y];
      data[i] = ele[0];
      data[i + 1] = ele[1];
      data[i + 2] = ele[2];
      data[i + 3] = ele[3];
    }
    if (dun) {
      dog('构建结束的时间', Date.now() - time);
      dog.type = true;
    }
    return imageData;
  }

  /**
   * ##构建渐变背景色图
   *
   * 触发时机：仅在下载背景图不可用时尝试创建渐变背景
   */
  private setLinearGradient() {
    if (dun) {
      dog.type = true;
    }
    const { renderData, options, elementMeta } = this;
    const { originStyle } = elementMeta;
    if (dun) {
      dog('渐变校验前', originStyle, options.imgUrl);
    }
    if (!/linear-gradient\(.*\)/.test(originStyle.backgroundImage) && !isArray(options.imgUrl)) {
      if (dun) {
        dog('当前不符合渐变配置', originStyle, options.imgUrl);
      }
      return this.setBackgroundColor();
    }
    const colorList =
      (isArray(options.imgUrl) && options.imgUrl.length > 1 && options.imgUrl) ||
      originStyle?.backgroundImage
        .replace(/^.*linear-gradient\((.*)\).*$/, '$1')
        .split('),')
        .map(e => {
          e = e.trim();
          if (!e.endsWith(')')) e += ')';
          return e;
        })
        .filter(e => e.startsWith('rgb') || e.startsWith('#')) ||
      [];

    if (colorList.length < 2) {
      if (dun) {
        dog('当前获取的渐变色值数量少于 2');
      }
      return this.setBackgroundColor();
    }
    /**  构建画布  */
    const canvas = document.createElement('canvas');
    /**  构建执行上下文  */
    const ctx = canvas.getContext('2d');

    if (isNull(ctx)) {
      if (dun) {
        dog('未获取执行上下文');
      }
      return this.setBackgroundColor();
    }
    const { backgroundInfo } = elementMeta;
    const { width, height } = backgroundInfo;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    /**  渐变画笔  */
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    colorList.forEach((e, i) => gradient.addColorStop(i / (colorList.length - 1), e));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    if (renderData.isTransitioning && !isEmptyArray(this.toBeList)) {
      /// 当前处于渐变过程，仅保留第一个
      this.toBeList.length = 1;
    } else {
      /// 当前不在渐变状态，直接清空渲染层
      this.toBeList.length = 0;
    }

    this.toBeList.push({
      resource: canvas,
      kind: 'linear-gradient',
      tag: colorList.join('_'),
      width,
      height,
      isDark: elementMeta.isDark,
    });
    if (dun) {
      dog('添加了渐变背景', colorList);
    }
    renderData.run();
  }

  /**
   * ## 构建背景色
   *
   * 执行时机：仅在构建渐变背景不可用时构建
   */
  private setBackgroundColor() {
    const { renderData, elementMeta } = this;
    if (dun) {
      dog.type = true;
    }
    // 验证不完全
    if (!this.checkIsSolidColor()) {
      return this.setTransparentTexture();
    }
    const { width, height } = elementMeta.backgroundInfo;
    const drawColor = this.getNewColor();
    const canvas = this.createCanvasByColor(drawColor);

    if (isNull(canvas)) {
      return this.setTransparentTexture();
    }

    if (renderData.isTransitioning && !isEmptyArray(this.toBeList)) {
      /// 当前处于渐变过程，仅保留第一个
      this.toBeList.length = 1;
    } else {
      /// 当前不在渐变状态，直接清空渲染层
      this.toBeList.length = 0;
    }

    const nestDrawImage: DrawImage = {
      resource: canvas,
      kind: 'background-color',
      tag: drawColor,
      width,
      height,
      isDark: elementMeta.isDark,
    };
    /// 在上面更改了 toBeList 的指向，这里必须使用全新的 fadeData.toBeList
    this.toBeList.push(nestDrawImage);
    if (dun) {
      dog('添加了背景色', drawColor, nestDrawImage);
    }
    renderData.run(); // 执行渐变
    if (dun) {
      dog('目前有', this.toBeList);
      dog.type = true;
    }
  }
  /**
   * ## 通过设置设定一个 canvas
   * @param drawColor
   */
  private createCanvasByColor(drawColor: string): null | HTMLCanvasElement {
    const { elementMeta } = this;
    /**  画布  */
    const canvas = document.createElement('canvas');
    /**  执行上下文  */
    const ctx = canvas.getContext('2d');
    if (isNull(ctx)) {
      if (dun) {
        dog('当前未获取到画布的执行上下文');
        dog.type = true;
      }
      return null;
    }
    const { width, height } = elementMeta.backgroundInfo;
    canvas.width = width;
    canvas.height = height;
    // 清理画布
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.fillStyle = drawColor;
    ctx.fillRect(0, 0, width, height);
    ctx.fill();
    return canvas;
  }

  /**
   * ## 加载图像
   *
   * 触发时机：
   *
   * - 事件触发 (父级尺寸发生变化时、父级设定样式发生变化时)
   * - 用户设定级别 imgUrl 发生变化时（在协调类中订阅）
   * - 初始化 GL 数据时
   *
   * 在加载过程中如果渲染的图片为非法的（加载错误）那么将查找当前的背景色或是背景图作为依据，再就是都没有的情况下将会渲染一个类似于旧地板的色
   */
  setImage() {
    if (dun) {
      dog.type = false;
      dog('开始下载图片');
    }
    const { options, elementMeta, renderData } = this;
    const { backgroundInfo } = elementMeta;
    const { width, height } = backgroundInfo;
    const newImageSource = this.getNewImage();
    if (dun) {
      dog('当前获取的图像资源为', newImageSource);
    }
    // 倘若图片资源未更改，则无需从新下载（但需要有值前提下）
    // 图片资源未更改，但是尺寸发生变化时亦会触发该方法
    renderData.imageSource = newImageSource!;
    // 虚假来源意味着没有背景。
    if (!newImageSource) {
      if (dun) {
        dog('没有原始图像，尝试使用渐变');
      }
      this.setLinearGradient();
      if (dun) {
        dog.type = true;
      }
      return;
    }
    // 从新图像加载纹理。
    const image = createImageBySrc(newImageSource, width, height);
    image.onload = () => {
      clearTimeout(renderData.transparentId); // 清理默认的渲染透明
      if (dun) {
        dog('当前下载背景图', newImageSource);
        dog('背景图下载完毕', this.toBeList.length);
        dog('当前是否在渐变', renderData.isTransitioning);
      }
      //  当前是否在渲染
      if (renderData.isTransitioning && !isEmptyArray(this.toBeList)) {
        // 下载有效背景时清理默认的背景纹理和同地址的背景纹理
        this.toBeList.length = 1;
        this.toBeList.push(
          ...this.toBeList
            .slice(1)
            .filter(
              e =>
                e.kind === 'image' &&
                (Math.abs(e.width - width) > 2 ||
                  Math.abs(e.height - height) > 2 ||
                  e.tag !== newImageSource),
            ),
        );
      } else {
        /// 当前并不在渐变直接清空带渲染层
        this.toBeList.length = 0;
      }
      this.toBeList.push({
        resource: image,
        width,
        height,
        kind: 'image',
        tag: newImageSource,
        isDark: elementMeta.isDark,
      }); // 设置渐变过去
      if (dun) {
        dog('添加后的列表长度', this.toBeList);
      }
      renderData.run(); // 开启渐变
      if (dun) {
        dog.type = true;
      }
    };

    // 下载图像出错
    image.onerror = () => {
      if (dun) {
        dog('下载图像错误');
      }
      this.setLinearGradient();
      if (dun) {
        dog.type = true;
      }
    };

    // 当图像源是数据 URI 时禁用 CORS。
    // TODO
    image.crossOrigin = options.crossOrigin;
  }

  /**
   *  ## 是否能执行渐变
   *
   * 返回值为 true 时禁止渐变
   *
   */
  forbiddenRunSide(): boolean {
    if (dun) {
      dog.type = true;
    }
    const { options, elementMeta, lastDrawImage } = this;
    const { imgUrl } = options;
    const { backgroundInfo } = elementMeta;
    const { width, height } = backgroundInfo;
    const { tag, kind } = lastDrawImage;
    /**  宽相等  */
    const widthIsEqual = lastDrawImage.width === width;
    /**  高相等  */
    const heightIsEqual = lastDrawImage.height === height;
    /**  尺寸没有变换  */
    const sizeEqual = widthIsEqual && heightIsEqual;
    if (this.checkIsImg()) {
      /**  当前的渲染地址  */
      const newImageSource: string | null = this.getNewImage();
      // 尺寸相同，资源相同，禁止变化
      if (kind === 'image' && sizeEqual && isString(newImageSource) && newImageSource === tag)
        return true;
      if (dun) {
        dog('通过图片校验');
      }
    }
    if (this.checkIsLinearGradient()) {
      /**  新的获取的渐变资源  */
      const newGradientValue = (isArray(imgUrl) && imgUrl.join('_')) || '';
      // 渐变禁止执行变化
      if (kind === 'linear-gradient' && sizeEqual && newGradientValue === tag) return true;
      if (dun) {
        dog('通过渐变校验', newGradientValue, tag);
      }
    }
    if (this.checkIsSolidColor()) {
      /**  当前的背景色值  */
      const newBackgroundColor = this.getNewColor();
      //  当前渲染为色值，且色值发生了变化
      if (kind === 'background-color' && sizeEqual && tag === newBackgroundColor) return true;
      if (dun) {
        dog('通过背景色校验');
      }
    }
    return false;
  }

  /**
   * 虽然叫构建透明纹理，但是个 `setTransparentTexture` 没有任何关系
   * @param tag 标签
   */
  createTransparentTexture(tag: string = ''): DrawImage {
    const { elementMeta } = this;
    const { width, height } = elementMeta.backgroundInfo;
    return {
      resource: this.createCanvasByColor(this.defaultColor) ?? this.createCanvasElementBySize(),
      width,
      height,
      kind: 'background-color',
      tag,
      isDark: elementMeta.isDark,
    };
  }

  /**
   * ## 校验是否是背景图
   */
  checkIsImg(): boolean {
    return this.getNewImage() !== null;
  }

  /**
   * ## 检验是否是渐变
   */
  checkIsLinearGradient(): boolean {
    const { elementMeta, options } = this;
    const { originStyle } = elementMeta;
    if (!/linear-gradient\(.*\)/.test(originStyle.backgroundImage) && !isArray(options.imgUrl)) {
      if (dun) {
        dog('当前不符合渐变配置');
      }
      return false;
    }
    const colorList = this.getColorList();
    if (colorList.length < 2) return false;
    return true;
  }

  /**
   * ## 检验是否是单色背景
   */
  checkIsSolidColor(): boolean {
    const { elementMeta, options } = this;
    const { originStyle } = elementMeta;
    // 验证不完全
    if (
      isNoneBackGroundColor(originStyle.backgroundColor) &&
      (!isArray(options.imgUrl) || options.imgUrl.length !== 1)
    ) {
      if (dun) {
        dog('当前没有配置背景色');
        dog.type = true;
      }
      return false;
    }
    return true;
  }

  /**
   * ## 校验是否是默认
   *
   * 嗯，你们都不是，那就是我啦
   */
  checkIsDefault() {
    return !(this.checkIsImg() || this.checkIsLinearGradient() || this.checkIsSolidColor());
  }

  /**
   *  ## 获取新的背景图
   *
   * 获取新的单色时已通过 {@link checkIsSolidColor()} 校验
   *
   * 如果遗漏或错误，返回当前颜色主题相近色
   */
  private getNewColor() {
    const { options, elementMeta } = this;
    const { originStyle } = elementMeta;
    return (
      (isArray(options.imgUrl) && options.imgUrl.length === 1 && options.imgUrl[0]) ||
      originStyle?.backgroundColor ||
      (elementMeta.isDark ? '#000000' : '#ffffff')
    );
  }

  /**
   * ## 获取当前的颜色列表
   */
  private getColorList(): string[] {
    const { options, elementMeta } = this;
    const { originStyle } = elementMeta;
    return (
      ((isArray(options.imgUrl) && options.imgUrl.length > 1 && options.imgUrl) ||
        originStyle?.backgroundImage
          .replace(/^.*linear-gradient\((.*)\).*$/, '$1')
          .split('),')
          .map(e => {
            e = e.trim();
            if (!e.endsWith(')')) e += ')';
            return e;
          })
          .filter(e => e.startsWith('rgb') || e.startsWith('#'))) ??
      []
    );
  }
  /**
   * ##  获取当前的背景图的地址
   */
  private getNewImage(): string | null {
    const { options, elementMeta } = this;
    const { imgUrl } = options;
    const { lastUseStyle } = elementMeta;
    return (isString(imgUrl) && imgUrl) || extractUrl(lastUseStyle?.backgroundImage);
  }
}
