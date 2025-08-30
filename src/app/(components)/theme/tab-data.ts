import { TabList } from '@/theme/Sidebar/types';
import { paragraphItem } from './paragraph';
import { headersItems } from './Headers';
import { inputsItems } from './Input';
import { radioItem } from './Radio';
import { toggleThemeColorModeItem } from './ToggleThemeMode';

export const tabList: TabList = [
  toggleThemeColorModeItem,
  headersItems,
  paragraphItem,
  inputsItems,
  radioItem,
];
