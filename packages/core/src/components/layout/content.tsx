import { xcn } from 'xcn';
import { LayoutContentContainer } from '../shared/EnLayoutContent/index';
import type { JSXComponentNoProps } from '../type';

/**
 * ## 内容区
 * @param props 组件属性
 */
const InternalValueC: JSXComponentNoProps = props => {
  const { className, ..._props } = props;
  return (
    <LayoutContentContainer
      className={xcn('en-layout-main', className)}
      data-enr-ui="layout-content"
      {..._props}
    />
  );
};
InternalValueC.displayName = 'LayoutContent';

export { InternalValueC };
