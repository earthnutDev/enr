/**
 * @packageDocumentation
 * @module @enr/type
 * @file type.ts
 * @description 组建公用类型声明
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-21 13:00
 * @version 2.0.0-alpha.0
 * @lastModified 2026-01-25 17:53
 */

import type {
  AnchorHTMLAttributes,
  AreaHTMLAttributes,
  AudioHTMLAttributes,
  BaseHTMLAttributes,
  BlockquoteHTMLAttributes,
  ButtonHTMLAttributes,
  CanvasHTMLAttributes,
  ColgroupHTMLAttributes,
  ColHTMLAttributes,
  ComponentPropsWithoutRef,
  DataHTMLAttributes,
  DelHTMLAttributes,
  DetailsHTMLAttributes,
  DialogHTMLAttributes,
  ElementType,
  EmbedHTMLAttributes,
  FieldsetHTMLAttributes,
  FormHTMLAttributes,
  HTMLAttributes,
  HtmlHTMLAttributes,
  IframeHTMLAttributes,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  InsHTMLAttributes,
  JSX,
  KeygenHTMLAttributes,
  LabelHTMLAttributes,
  LiHTMLAttributes,
  LinkHTMLAttributes,
  MapHTMLAttributes,
  MediaHTMLAttributes,
  MenuHTMLAttributes,
  MetaHTMLAttributes,
  MeterHTMLAttributes,
  ObjectHTMLAttributes,
  OlHTMLAttributes,
  OptgroupHTMLAttributes,
  OptionHTMLAttributes,
  OutputHTMLAttributes,
  ParamHTMLAttributes,
  ProgressHTMLAttributes,
  QuoteHTMLAttributes,
  Ref,
  ScriptHTMLAttributes,
  SelectHTMLAttributes,
  SlotHTMLAttributes,
  SourceHTMLAttributes,
  StyleHTMLAttributes,
  SVGAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  TextareaHTMLAttributes,
  ThHTMLAttributes,
  TimeHTMLAttributes,
  TrackHTMLAttributes,
  VideoHTMLAttributes,
  WebViewHTMLAttributes,
} from 'react';

/**
 * ## 基本元素属性映射（Map）
 *
 * 通过元素标签名获取该元素对应的属性类型。
 *
 * ```ts
 * import type { BaseElementAttributesMap } from 'enr';
 *
 * function Div(props: BaseElementAttributesMap['div']) {
 *  return <div {...props}>hello Mr.MudBean </div>
 * }
 * ```
 */
export type BaseElementAttributesMap = {
  //  基础元素
  img: ImgHTMLAttributes<HTMLImageElement>;
  input: InputHTMLAttributes<HTMLInputElement>;
  a: AnchorHTMLAttributes<HTMLAnchorElement>;
  button: ButtonHTMLAttributes<HTMLButtonElement>;
  details: DetailsHTMLAttributes<HTMLDetailsElement>;
  textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;
  select: SelectHTMLAttributes<HTMLSelectElement>;
  options: OptionHTMLAttributes<HTMLOptionElement>;
  fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement>;
  label: LabelHTMLAttributes<HTMLLabelElement>;
  form: FormHTMLAttributes<HTMLFormElement>;
  area: AreaHTMLAttributes<HTMLAreaElement>;
  blockquote: BlockquoteHTMLAttributes<HTMLElement>;
  'block-quote': BlockquoteHTMLAttributes<HTMLElement>;
  colgroup: ColgroupHTMLAttributes<HTMLElement>;
  del: DelHTMLAttributes<HTMLElement>;
  dialog: DialogHTMLAttributes<HTMLDialogElement>;
  html: HtmlHTMLAttributes<HTMLHtmlElement>;
  ins: InsHTMLAttributes<HTMLElement>;
  keygen: KeygenHTMLAttributes<HTMLElement>;
  menu: MenuHTMLAttributes<HTMLMenuElement>;
  optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement>;
  'opt-group': OptgroupHTMLAttributes<HTMLOptGroupElement>;
  progress: ProgressHTMLAttributes<HTMLProgressElement>;
  quote: QuoteHTMLAttributes<HTMLQuoteElement>;
  slot: SlotHTMLAttributes<HTMLSlotElement>;
  time: TimeHTMLAttributes<HTMLTimeElement>;
  webview: WebViewHTMLAttributes<HTMLWebViewElement>;

  // 媒体元素
  media: MediaHTMLAttributes<HTMLMediaElement>;
  canvas: CanvasHTMLAttributes<HTMLCanvasElement>;
  video: VideoHTMLAttributes<HTMLVideoElement>;
  audio: AudioHTMLAttributes<HTMLAudioElement>;
  source: SourceHTMLAttributes<HTMLSourceElement>;
  track: TrackHTMLAttributes<HTMLTrackElement>;
  map: MapHTMLAttributes<HTMLMapElement>;
  output: OutputHTMLAttributes<HTMLOutputElement>;

  // 表格元素
  table: TableHTMLAttributes<HTMLTableElement>;
  // tbody: TbodyHTMLAttributes<HTMLTableSectionElement>;
  td: TdHTMLAttributes<HTMLTableCellElement>;
  col: ColHTMLAttributes<HTMLTableColElement>;
  // tr: TrHTMLAttributes<HTMLTableRowElement>;
  th: ThHTMLAttributes<HTMLTableHeaderCellElement>;

  // 列表元素
  ol: OlHTMLAttributes<HTMLOListElement>;
  // ul: UlHTMLAttributes<HTMLUListElement>;
  li: LiHTMLAttributes<HTMLLIElement>;
  // dl: DlHTMLAttributes<HTMLDListElement>;
  data: DataHTMLAttributes<HTMLDataElement>;
  // datalist: DataListHTMLAttributes<HTMLDataListElement>;

  // 嵌入元素
  iframe: IframeHTMLAttributes<HTMLIFrameElement>;
  embed: EmbedHTMLAttributes<HTMLEmbedElement>;
  object: ObjectHTMLAttributes<HTMLObjectElement>;
  param: ParamHTMLAttributes<HTMLParamElement>;

  // 元数据元素
  meta: MetaHTMLAttributes<HTMLMetaElement>;
  base: BaseHTMLAttributes<HTMLBaseElement>;
  style: StyleHTMLAttributes<HTMLStyleElement>;
  link: LinkHTMLAttributes<HTMLLinkElement>;
  meter: MeterHTMLAttributes<HTMLMeterElement>;
  script: ScriptHTMLAttributes<HTMLScriptElement>;

  //  SVG 元素
  svg: SVGAttributes<SVGSVGElement>;
  circle: SVGAttributes<SVGCircleElement>;
  rect: SVGAttributes<SVGRectElement>;
  path: SVGAttributes<SVGPathElement>;
};

/**
 * ## 从元素标签获取元素类型
 * @example
 * ```ts
 * import type { ElementTypeFromTagName } from 'enr';
 *
 * export const Box = (props:
 *  HTMLAttributes<ElementTypeFormTagName<'div'>>
 * ) =>
 *    <div {...props} />
 * ```
 * 尽然，貌似使用还挺麻烦，但是这个是为了 `BaseElementAttributesMap` 结合 `TagNameFromElementType` 使用的。
 *
 * 嗯，就是 `WithRefForElement`
 *
 * ```ts
 *  HTMLAttributes<ElementTypeFormTagName<'div'>> === BaseElementAttributesMap<'div'>
 * ```
 */
export type ElementTypeFromTagName<
  T extends keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap,
> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : T extends keyof SVGElementTagNameMap
    ? SVGElementTagNameMap[T]
    : never;

/**
 * ## 从元素类型获取标签名
 *
 * @example
 *
 * ```ts
 * import type {
 *  TagNameFromElementType ,
 *  BaseElementAttributesMap ,
 * } from 'enr';
 *
 * export const Box = (props:
 *  BaseElementAttributesMap<
 *    TagNameFromElementType<HTMLElement>
 *  >
 * ) => <div  {...props} />
 * ```
 */
export type TagNameFromElementType<T extends Element> = {
  [K in
    | keyof HTMLElementTagNameMap
    | keyof SVGElementTagNameMap]: ElementTypeFromTagName<K> extends T ? K : never;
}[HTMLTagName];

/**
 *  ## 从元素类型获取属性
 *
 * @example
 * ```ts
 * import type { ElementTypeToProps } from 'enr';
 *
 * export const Box = (props:
 *  ElementTypeToProps<HTMLElement>
 * ) => <div {...props} />
 * ```
 */
export type ElementTypeToProps<T extends Element> =
  TagNameFromElementType<T> extends keyof BaseElementAttributesMap
    ? BaseElementAttributesMap[TagNameFromElementType<T>]
    : T extends SVGElement
      ? SVGAttributes<SVGElement>
      : HTMLAttributes<T>;

/**
 * ## 可能携带 `ref` 属性
 */
export type MayWithRef<T extends HTMLElement | SVGElement> = {
  ref?: React.Ref<T>;
};

/** 基础 HTML 元素标签名 */
export type HTMLTagName = keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap;

/**
 * ## 使用 Ref 包裹的元素组件参数类型
 */
export type WithRefForElement<T extends HTMLElement> = ElementTypeToProps<T> & MayWithRef<T>;

/**
 * ## 智能从元素标签名判定属性
 * `ElementTypeToProps` 的同袍弟弟。
 * @example
 * ```ts
 * import type { TagNameToProps } from 'ern';
 *
 * export const Box = (
 *  props: TagNameToProps<'div'>
 * ) =>
 *    <div {...props} />
 * ```
 */
export type TagNameToProps<T extends HTMLTagName> = T extends keyof BaseElementAttributesMap
  ? BaseElementAttributesMap[T]
  : ElementTypeFromTagName<T> extends SVGElement
    ? SVGAttributes<SVGElement>
    : HTMLAttributes<ElementTypeFromTagName<T>>;

/**
 * ## 使用元素标签名包装携带 Ref 的元素组件参数类型
 */
export type WithRefForTagName<T extends HTMLTagName = 'div'> = TagNameToProps<T> &
  MayWithRef<ElementTypeFromTagName<T>>;

/**
 * ## 其他可配置的属性
 */
export type JSXOtherAttribute = {
  /** 展示名 */
  displayName?: string;
  /** 默认属性 */
  defaultProps?: any;
  /** Prop 类型校验（JS 项目） */
  propTypes?: any;
};

/**
 * ## 简单对象类型
 */
export type SimpleObject = Record<string, any>;

/**
 *  ## 简单的属性包装器
 *
 *  如果不使用自定义参数，直接使用 **`WithRefForElement<Element>`** 即可
 *
 * @example
 *
 * ```ts
 * import { PropsWithElement } from 'enr';
 *
 * // 常规使用
 * export const Box = (
 *  props: PropsWithElement
 * ) => <div {...props} />
 *
 * // 携带自定义参数的用法
 * export const Box = (
 *  {
 *    age,
 *    ...props
 *  }: PropsWithElement<{
 *    age: number;
 *  }>
 * ) =>  <div {...props}>{ age < 18 ? '少儿不宜' : 'www.yandex.com' }</div>
 *
 * // 携带自定义参数并指定特定的元素的用法
 * export const Box = (
 *  {
 *    age,
 *    ...props
 *  }: PropsWithElement<{
 *    age: number;
 *  } , HTMLSpanElement>
 * ) =>  <span {...props}>{ age < 18 ? '少儿不宜' : 'www.yandex.com' }</span>
 * ```
 *
 */
export type PropsWithElement<
  CustomProps = SimpleObject,
  Element extends HTMLElement = HTMLDivElement,
> = WithRefForElement<Element> & CustomProps;

/**
 * ## 构建带类型声明的组件（HTMLElement 版）
 *
 * @example
 *
 * ```ts
 * import { styled , css } from 'styled-components';
 * import type { JSXComponentForElement } from 'enr';
 *
 * // 常规使用（ 默认无参数 ，div 元素）
 * export const Box: JSXComponentForElement = styled.div`
 *     display: inline-block;
 *     padding: 4px 12px;
 * `;
 *
 * // 带参数使用 （div 元素）
 * export const OtherBox: JSXComponentForElement<{
 *    $type: boolean
 * }> = styled.div`
 *     display: inline-block;
 *     padding: 4px 12px;
 *     cursor: ${({$type}) =>
 *        ($type ?
 *         css`
 *           left: 15%;
 *           background-color: rgba(120, 120, 120, 0.6);
 *         `
 *         : css`
 *           left: 45%;
 *           background-color: rgba(35, 70, 247, 1);
 *         `
 *        )
 *     }
 * `;
 *
 * // 带参数且需要指定元素类型
 * export const LastExampleBox: JSXComponentForElement<{
 *   $type: boolean
 * }, HTMLInputElement>
 *  = styled.input`
 *     display: inline-block;
 *     padding: 4px 12px;
 *     cursor: ${({$type}) =>
 *        ($type ?
 *         css`
 *           left: 15%;
 *           background-color: rgba(120, 120, 120, 0.6);
 *         `
 *         : css`
 *           left: 45%;
 *           background-color: rgba(35, 70, 247, 1);
 *         `
 *        )
 *     }
 * `;
 * ```
 *
 * 由于 V5+ 版本移除了 `StyledComponent` 范性，导致在当前库中出现了：
 *
 * ```bash
 * The inferred type of 'Xxxxx' cannot be named without a reference
 * to '../../../../../node_modules/styled-components/dist/types'.
 * This is likely not portable. A type annotation is necessary.
 * ```
 *
 * 所以需要显式的声明 styled-components 构建的组件的类型
 *
 * 可以通过第一参数限定
 */
export type JSXComponentForElement<
  CustomProps extends SimpleObject = SimpleObject,
  Element extends HTMLElement = HTMLDivElement,
> = { (props: PropsWithElement<CustomProps, Element>): JSX.Element } & JSXOtherAttribute;

/**
 * ## 构建带类型声明的组件（无自定义参数 HTMLElement 组件版）
 * 是 `JSXComponentForElement` 的衍生类型，等同于 `JSXComponentForElement<{} , TagName>`
 * @example
 *
 * ```ts
 * import { styled } from 'styled-components';
 * import type { JSXComponentNoPropsForElement } from 'enr';
 *
 * // 常规使用（ div 元素）
 * export const Box: JSXComponentNoPropsForElement = styled.div`
 *     display: inline-block;
 *     padding: 4px 12px;
 * `;
 *
 * // 带参数使用 （div 元素）
 * export const OtherBox: JSXComponentNoPropsForElement<'input'> =
 *   styled.input`
 *     display: inline-block;
 *     padding: 4px 12px;
 * `;
 * ```
 */
export type JSXComponentNoPropsForElement<Element extends HTMLElement = HTMLDivElement> = {
  (props: WithRefForElement<Element>): JSX.Element;
} & JSXOtherAttribute;

/**
 *  ## 简单的属性包装器
 *
 *  如果不使用自定义参数，直接使用 **`WithRefForTagName<tagname>`** 即可
 *
 * @example
 *
 * ```ts
 * import { PropsWithTagName } from 'enr';
 *
 * // 常规使用
 * export const Box = (
 *  props: PropsWithTagName
 * ) => <div {...props} />
 *
 * // 携带自定义参数的用法
 * export const Box = (
 *  {
 *    age,
 *    ...props
 *  }: PropsWithTagName<{
 *    age: number;
 *  }>
 * ) =>  <div {...props}>{ age < 18 ? '少儿不宜' : 'www.yandex.com' }</div>
 *
 * // 携带自定义参数并指定特定的元素的用法
 * export const Box = (
 *  {
 *    age,
 *    ...props
 *  }: PropsWithTagName<{
 *    age: number;
 *  } , 'span'>
 * ) =>  <span {...props}>{ age < 18 ? '少儿不宜' : 'www.yandex.com' }</span>
 * ```
 *
 */
export type PropsWithTagName<
  CustomProps = SimpleObject,
  TagName extends HTMLTagName = 'div',
> = WithRefForTagName<TagName> & CustomProps;

export type PropsWithTagNameCustomRef<
  CustomProps = SimpleObject,
  TagName extends HTMLTagName = 'div',
  RefType = SimpleObject,
> = CustomProps &
  TagNameToProps<TagName> & {
    ref?: Ref<RefType>;
  };

/**
 * ## 构建带类型声明的组件（元素标签版）
 *
 * @example
 *
 * ```ts
 * import { styled , css } from 'styled-components';
 * import type { JSXComponent } from 'enr';
 *
 * // 常规使用（ 默认无参数 ，div 元素）
 * export const Box: JSXComponent = styled.div`
 *     display: inline-block;
 *     padding: 4px 12px;
 * `;
 *
 * // 带参数使用 （div 元素）
 * export const OtherBox: JSXComponent<{
 *    $type: boolean
 * }> = styled.div`
 *     display: inline-block;
 *     padding: 4px 12px;
 *     cursor: ${({$type}) =>
 *        ($type ?
 *         css`
 *           left: 15%;
 *           background-color: rgba(120, 120, 120, 0.6);
 *         `
 *         : css`
 *           left: 45%;
 *           background-color: rgba(35, 70, 247, 1);
 *         `
 *        )
 *     }
 * `;
 *
 * // 带参数且需要指定元素类型
 * export const LastExampleBox: JSXComponent<{
 *   $type: boolean
 * }, 'input'>
 *  = styled.input`
 *     display: inline-block;
 *     padding: 4px 12px;
 *     cursor: ${({$type}) =>
 *        ($type ?
 *         css`
 *           left: 15%;
 *           background-color: rgba(120, 120, 120, 0.6);
 *         `
 *         : css`
 *           left: 45%;
 *           background-color: rgba(35, 70, 247, 1);
 *         `
 *        )
 *     }
 * `;
 * ```
 *
 * 由于 V5+ 版本移除了 `StyledComponent` 范性，导致在当前库中出现了：
 *
 * ```bash
 * The inferred type of 'Xxxxx' cannot be named without a reference
 * to '../../../../../node_modules/styled-components/dist/types'.
 * This is likely not portable. A type annotation is necessary.
 * ```
 *
 * 所以需要显式的声明 styled-components 构建的组件的类型
 *
 * 可以通过第一参数限定
 */
export type JSXComponent<
  CustomProps extends SimpleObject = SimpleObject,
  TagName extends HTMLTagName = 'div',
> = { (props: WithRefForTagName<TagName> & CustomProps): JSX.Element } & JSXOtherAttribute;

/**
 * ## 无自定义属性类型（元素标签版）
 * 等同于 `JSXComponent<{}, TagName>`
 * @example
 *
 * ```ts
 * import { styled } from 'styled-components';
 * import type { JSXComponentNoProps } from 'enr';
 *
 * // 常规使用（ div 元素）
 * export const Box: JSXComponentNoProps = styled.div`
 *     display: inline-block;
 *     padding: 4px 12px;
 * `;
 *
 * // 指定元素类型使用
 * export const OtherBox: JSXComponentNoProps<'input'>
 *    = styled.input`
 *     display: inline-block;
 *     padding: 4px 12px;
 *     cursor: ${({$type}) =>
 *        ($type ?
 *         css`
 *           left: 15%;
 *           background-color: rgba(120, 120, 120, 0.6);
 *         `
 *         : css`
 *           left: 45%;
 *           background-color: rgba(35, 70, 247, 1);
 *         `
 *        )
 *     }
 * `;
 *
 * ```
 */
export type JSXComponentNoProps<TagName extends HTMLTagName = 'div'> = {
  (props: WithRefForTagName<TagName>): JSX.Element;
} & JSXOtherAttribute;

/**
 * ## 作为元素使用
 */
type AsProp<As extends ElementType = 'div'> = {
  as?: As;
};

/**
 * ## 合并属性
 */
type MergeProps<As extends ElementType> = AsProp<As> &
  Omit<ComponentPropsWithoutRef<As>, keyof AsProp>;

/**
 * ## 多态组件
 *
 * 支持多种元素类型的组件，常用于构建框架 UI
 *
 * TODO : React 不推荐使用 <Component /> 尽然类式组件当前已久被支持
 * @example
 * ```ts
 * import type { PolymorphicComponent } from 'enr';
 *
 * export const Input: PolymorphicComponent<'input'> = ({
 *  as: Component = 'input',
 *  ref,
 *  ...props,
 * }) => <Component ref={ref} {...props} />
 * ```
 */
export type PolymorphicComponent<T = {}, DefaultElement extends ElementType = ElementType> = (<
  As extends ElementType = DefaultElement,
>({
  as,
  ...props
}: MergeProps<As> & { ref?: Ref<Element> } & T) => JSX.Element) &
  JSXOtherAttribute;
