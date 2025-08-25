import { Layout, LayoutContent, LayoutHeader } from 'components/layout';
import { _en } from 'customHooks/use-xcn';
import Link from 'next/link';

/**  主题页面测试  */
export default function ThemePage() {
  return (
    <Layout>
      <LayoutHeader>
        <div className={_en('en-full-container')}>
          <div className={_en('en-float-left')}>
            <Link href={'/'}>其他组件测试</Link>
          </div>
          <div className={_en('en-float-right')}>45</div>
        </div>
      </LayoutHeader>
      <LayoutContent>具体内容</LayoutContent>
    </Layout>
  );
}
