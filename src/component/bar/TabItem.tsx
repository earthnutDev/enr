'use client';

import Link from 'next/link';
import { xcn } from 'xcn';
import styles from './index.module.scss';
import { usePathname } from 'next/navigation';
import { TabItemProps } from './types';

export function TabItem({ data }: TabItemProps) {
  const path = usePathname();

  const iseActive =
    (path === '/' && data.url == '') || (path !== '/' && data.url.startsWith(path))
      ? styles.active
      : '';

  return (
    <>
      <Link href={data.url} className={xcn(iseActive, data.type === 'link' && styles.link)}>
        {data.text}
      </Link>
    </>
  );
}
