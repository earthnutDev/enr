import { Marquee } from 'components/marquee';
import React from 'react';
import { CreateMarqueeContent } from './createConten';

/**  跑马灯的页面展示  */
export default function MarqueePage() {
  return (
    <CreateMarqueeContent>
      <Marquee>
        <div>12</div>
        查看效果
      </Marquee>
    </CreateMarqueeContent>
  );
}
