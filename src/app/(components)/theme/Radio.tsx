import { TabListItem } from '@/theme/Sidebar/types';
import { _en } from 'index.server';
import { HTMLAttributes, useState } from 'react';

const id = 'radio-theme';

export const radioItem: TabListItem = {
  text: '单选按钮',
  url: '#'.concat(id),
};

/**  单选按钮  */
function Radio({
  cum: i,
  checked,
  ...props
}: { cum: number; checked: boolean } & HTMLAttributes<HTMLLabelElement>) {
  return (
    <>
      <input type="radio" id={`radio-${i}`} name={'check-1'} checked={checked} onChange={() => 1} />
      <label htmlFor={`radio-${i}`} {...props}>
        单选 {i + 1}
      </label>
    </>
  );
}

/**  单选按钮组  */
export function RadioDemoTheme() {
  const [checkedPrefix, setCheckedPrefix] = useState(0);

  return (
    <div id={id} className={_en('en-style')}>
      <form>
        <fieldset>
          <legend>请选择一个</legend>
          {new Array(4).fill(0).map((e, i) => (
            <Radio
              key={e + i}
              cum={i}
              checked={checkedPrefix === i}
              onClick={() => setCheckedPrefix(i)}
            />
          ))}
        </fieldset>
      </form>
    </div>
  );
}
