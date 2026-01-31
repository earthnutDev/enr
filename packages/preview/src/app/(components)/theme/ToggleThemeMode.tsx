import { _en, useColorMode, type ColorMode } from 'enr';
import { dog, dun } from 'zza/log';
import type { TabListItem } from '@/theme/Sidebar/types';

const id = 'toggle-theme-mode';
export const toggleThemeColorModeItem: TabListItem = {
  label: '切换主题样式',
  url: '#'.concat(id),
};

/**  切换主题样式  */
export function ToggleThemeColorMode() {
  const { colorMode, autoColorMode, setColorMode, clearColorMode } = useColorMode();

  const colorModeList: (ColorMode | 'system')[] = ['light', 'system', 'dark'];

  /**
   *  切换当前的模式
   * @param e
   */
  function clickFn(e: ColorMode | 'system') {
    if (dun) {
      dog('执行了更改当前的主题色模式', e);
    }
    if (e !== 'system') setColorMode(e);
    else clearColorMode();
  }

  return (
    <div className={_en('style', 'flex-row', 'padding-horizontal-8')}>
      {colorModeList.map(e => (
        <div key={e} onClick={() => clickFn(e)}>
          <input
            type="radio"
            id={`color-mode-${e}`}
            name="test-color-mode"
            onChange={() => 0}
            checked={(autoColorMode && e === 'system') || (!autoColorMode && e === colorMode)}
          />
          <label htmlFor={`color-mode-${e}`}>{e}</label>
        </div>
      ))}
      <div className={_en('dark', 'weird-dark')}>123</div>
      <div className={_en('light', 'weird-dark')}>123</div>
    </div>
  );
}
