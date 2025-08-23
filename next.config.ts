import type { NextConfig } from 'next';
import { _p } from 'a-node-tools';
import { brightYellowPen, cyanPen, greenPen, magentaPen } from 'color-pen';
import { isUndefined } from 'a-type-of-js';
import { copyTextToClipboard } from '@qqi/copy-text';

/** 启动端口  */
const port = process.env.PORT ?? '0';

const nextConfig: NextConfig = {
  // styled components 的 css in js 配置
  compiler: {
    styledComponents: true,
  },
  eslint: {
    /// 构建的时候忽略错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    /// 构建打包时忽略错误
    ignoreBuildErrors: true,
    // ignoreDevErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /// 接受的文件类型
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  /// 设置 nextJs 携带的标头
  poweredByHeader: true,
};

/// 未读取端口号不算
if (port !== '0') {
  const _ = 'OPEN_COUNT_OF_EARTH';
  const __ = process.env[_];
  if (!isUndefined(__)) clearTimeout(__);
  const url = 'http:localhost:'.concat(port);
  process.env[_] =
    setTimeout(() => {
      _p(`项目已${cyanPen`开启:`} ${magentaPen(url)}`, false);
      copyTextToClipboard(url);
      _p(greenPen`  已复制`);
    }, 2000) + '';
}

process.on('exit', () => _p(brightYellowPen`额走了`));

export default nextConfig;
