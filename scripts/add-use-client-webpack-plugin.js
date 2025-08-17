import webpack from 'webpack';
/**
 * 头添加 'use client';
 *
 *  以支持在云上使用
 */
export default class AddUserClientPlugin {
  /**  执行和姓  */
  apply(compiler) {
    // 在 compilation 阶段添加插件
    compiler.hooks.thisCompilation.tap('AddUserClientPlugin', compilation => {
      // 在 processAssets 阶段添加插件
      compilation.hooks.processAssets.tap(
        {
          name: 'AddUserClientPlugin',
          // 指定插件的执行阶段
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        assets => {
          // 遍历所有资源
          for (const filename in assets) {
            // 如果文件名以 .mjs 结尾
            if (filename.endsWith('.mjs') || filename.endsWith('.cjs')) {
              // 获取原始资源
              const source = assets[filename].source();
              // 在原始资源的开头添加 'use client;'
              const newSource = '"use client";\n'.concat(source);

              // 替换原始资源
              compilation.updateAsset(filename, new webpack.sources.RawSource(newSource));
            }
          }
        },
      );
    });
  }
}
