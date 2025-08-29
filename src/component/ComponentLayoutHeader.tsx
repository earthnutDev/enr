import { _en } from 'index.server';
import Link from 'next/link';

/**  组件布局的头部  */
export function ComponentLayoutHeader() {
  return (
    <div className={_en('en-center')}>
      <Link href={'https://lmssee.com'} target="_blank">
        earthnut react ui
      </Link>
      部分组件功能展示
    </div>
  );
}
