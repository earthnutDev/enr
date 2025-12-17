import { TabListItem } from '@/theme/Sidebar/types';
import { _en } from 'packages/enr/index.server';

const id = 'paragraph-theme';

export const paragraphItem: TabListItem = {
  text: '段落',
  url: '#'.concat(id),
};

/**  使用段落展示正文的样式  */
export function ParagraphMode() {
  return (
    <div id={id} className={_en('en-flex-column', 'en-style')}>
      <h1>咏鹅</h1>
      <div className={_en('en-flex-column', 'en-text-center')}>
        <p>鹅，鹅，鹅</p>
        <p>天天伸个脖</p>
        <p>叫得比谁都响</p>
        <p>吃的比谁都多</p>
      </div>
    </div>
  );
}
