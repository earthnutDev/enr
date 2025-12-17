import { TabListItem } from '@/theme/Sidebar/types';
import { ColorMode } from 'dist/type';
import { dog } from 'packages/enr/dog';
import { useColorMode } from 'packages/enr/index.client';
import { _en } from 'packages/enr/index.server';

const id = 'toggle-theme-mode';
export const toggleThemeColorModeItem: TabListItem = {
  text: '切换主题样式',
  url: '#'.concat(id),
};

/**  切换主题样式  */
export function ToggleThemeColorMode() {
  const { colorMode, autoColorMode, setColorMode, clearColorMode } = useColorMode();

  const colorModeList: (ColorMode | 'system')[] = ['light', 'system', 'dark'];

  /**  切换当前的模式  */
  function clickFn(e: ColorMode | 'system') {
    dog('执行了更改当前的主题色模式', e);
    if (e !== 'system') setColorMode(e);
    else clearColorMode();
  }

  return (
    <div className={_en('en-style', 'en-flex-row', 'en-padding-horizontal-8')}>
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
      <div className={_en('en-dark', 'en-weird-dark')}>123</div>
      <div className={_en('en-light', 'en-weird-dark')}>123</div>
    </div>
  );
}
