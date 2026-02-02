import { xcn } from 'xcn';
import { LayoutSideBarContainer } from '../shared/EnLayoutContent/index';
import type { LayoutSideBarProps } from './types';

/**
 * ## 侧边栏
 *
 * @param props 组件属性
 * @param props.width 侧边栏的宽度。缺省值为 `150px`
 * @param props.right 是否居右。缺省值为 `false`
 * @param props.full 是否占用所有空间。缺省值为 `false`
 * @returns `ReactElement`;
 *
 */
const InternalValueS = ({
  width: _width = 150,
  right: _right = false,
  full: _full = false,
  ...props
}: LayoutSideBarProps) => {
  const { className, ..._props } = props;
  return (
    <LayoutSideBarContainer
      className={xcn('enr-layout-side', className)}
      {..._props}
      data-enr-ui="layout-side-bar"
    />
  );
};

InternalValueS.displayName = 'LayoutSideBar';

export { InternalValueS };
