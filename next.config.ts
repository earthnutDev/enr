import type { NextConfig } from 'next';

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

export default nextConfig;
