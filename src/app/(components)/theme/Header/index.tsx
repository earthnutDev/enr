import { _en } from 'index.server';
import { ThemeModeTitle } from './Title';
import { ColorModeToggle } from '@/theme/ColorModeToggle';

/**  头部数据  */
export function ThemeModeLayoutHeader() {
  return (
    <div className={_en('en-flex', 'en-full-container')}>
      <ThemeModeTitle />
      <ColorModeToggle
        className={_en('en-padding-horizontal-24')}
        style={{
          lineHeight: 'var(--layout-header-height)',
        }}
      />
    </div>
  );
}
