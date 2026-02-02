import { xcn } from 'xcn';
import { LayoutHeaderContainer } from '../shared/EnLayoutContent/index';
import type { LayoutHeaderProps } from './types';

/**
 * ## 布局头部
 *
 * @param props
 * @param props.height 头部的高度
 * @param props.noSticky 禁止头部黏连
 * @returns ReactElement
 */
const InternalValueH = ({ height: _height, noSticky: _noSticky, ...props }: LayoutHeaderProps) => {
  const { className, ..._props } = props;
  return (
    <LayoutHeaderContainer
      className={xcn(['en-layout-header'], className)}
      data-enr-ui="layout-header"
      {..._props}
    />
  );
};

InternalValueH.displayName = 'LayoutHeader';

export { InternalValueH };
