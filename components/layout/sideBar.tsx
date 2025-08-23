import { LayoutSideBarProps } from './types';
import { xcn } from 'xcn';
import { LayoutSideBarContainer } from 'components/shared/EnLayoutContent';
import { forwardRef } from 'react';

/**
 *
 * children side bar
 *
 * 侧边栏
 *
 *
 * @param children 子元素
 * @param ref 组件引用
 * @param props 组件属性
 * @param className 自定义类名
 * @param width 侧边栏的宽度
 *  缺省值为 `150px`
 * @param right 是否居右
 *  缺省值为 `false`
 * @param full 是否占用所有空间
 *  缺省值为 `false`
 * @returns `ReactElement`;
 *
 */
const InternalValueS = forwardRef<
  HTMLDivElement,
  LayoutSideBarProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ className, width = 150, right = false, full = false, ...props }, ref) => {
  return (
    <LayoutSideBarContainer
      className={xcn('en-layout-side', className)}
      ref={ref}
      {...props}
      data-earthnut-ui="layout-side-bar"
    />
  );
});

InternalValueS.displayName = 'LayoutSideBar';

export { InternalValueS };
