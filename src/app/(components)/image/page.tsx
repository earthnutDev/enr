import { Image } from 'components/image/';
import React from 'react';
import styles from './index.module.scss';
import { xcn } from 'xcn';

/**  图像测试  */
export default function ImagePage() {
  return (
    <div>
      <div>
        <Image src="/image/defaultBackground.png" className={xcn(styles.img)} />
      </div>
    </div>
  );
}
