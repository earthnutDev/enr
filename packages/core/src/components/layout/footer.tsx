import { xcn } from 'xcn';
import { LayoutFooterContent } from '../shared/EnLayoutContent/index';
import type { LayoutFooterProps } from './types';

/**
 * ## 布局底部
 *
 * @param props 属性
 * @param props.height 定义的高
 * @returns ReactElement
 *
 */
const InternalValueF = ({ height: _height, ...props }: LayoutFooterProps) => {
  const { className, ..._props } = props;
  return (
    <LayoutFooterContent
      className={xcn('en-layout-footer', className)}
      data-enr-ui="layout-footer"
      {..._props}
    />
  );
};

InternalValueF.displayName = 'LayoutFooter';

export { InternalValueF };
