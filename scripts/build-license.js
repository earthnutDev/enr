import { basename, resolve } from 'node:path';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileExist, pathJoin, readFileToJsonSync } from 'a-node-tools';
import { isUndefined } from 'a-type-of-js';
/**
 *
 * 构建许可证明及写入 index.mjs 文件内容
 *
 */
const __dirname = import.meta.dirname;

const packInfo = readFileToJsonSync(pathJoin(__dirname, '../package.json')) ?? {
  name: 'earthnut',
};
/**  许可证明头部  */
const licenseHeader = filePath => `/**
 * @license MIT
 * ${packInfo?.name}${filePath} 
 * Copyright (c) ${new Date().getFullYear()} earthnut.dev
 * 请在项目根参看详细许可证明
 */
`;
// 执行的根
const distDir = resolve(__dirname, '..', 'dist');
// 根入口文件
const indexFile = resolve(__dirname, '..', 'index.ts');

/**  添加协议  */
function addLicense(dir) {
  readdirSync(dir).forEach(file => {
    /**  文件路径  */
    const filePath = pathJoin(dir, file);
    /**  文件的名（不带扩展名）  */
    const fileBashName = basename(filePath, '.mjs');
    /**  是否添加 use client  */
    const isAddUseClient = ['client', 'layoutUtil'].some(e => fileBashName === e);
    /**  use client 文本 （已校验） */
    const useClientMessage = isAddUseClient ? '\n"use client";\n' : '';
    /**  文件是否存在（其实，一定存在）  */
    const isExist = fileExist(filePath);
    if (isUndefined(isExist)) return; // 不存在直接返回

    if (isExist.isDirectory()) return addLicense(filePath); // 当前识别文文件夹

    if (['.mjs', '.js', '.cjs', '.d.ts'].some(e => file.endsWith(e))) {
      const content = readFileSync(filePath, 'utf8');

      if (!content.includes('@license')) {
        writeFileSync(
          filePath,
          licenseHeader(filePath.replace(distDir, '').replace('/', '@')) +
            useClientMessage +
            content,
        );
      } else if (isAddUseClient) {
        writeFileSync(filePath, '\n"use client";\n' + content);
      }
    }
  });
}

addLicense(distDir);

const index = readFileSync(indexFile, 'utf8');

/// 写入根导入导出
(() => {
  writeFileSync(
    pathJoin(distDir, 'index.mjs'),
    index
      .replace(/\/+\s+>>>.*\/+\s+<<</s, '') // 移除类型导出
      .replace('index.server', 'server.mjs') // 更改导出
      .replace('index.client', 'client.mjs'),
  );
})();

// 向 styles 目录写入文件
(() => {
  try {
    const stylesDir = pathJoin(distDir, 'styles');
    const items = readdirSync(stylesDir);
    items.forEach(_item => {
      const item = pathJoin(stylesDir, _item);
      const itemState = fileExist(item);

      // 非文件
      if (!itemState || !itemState.isFile() || !(item.endsWith('.scss') || item.endsWith('.css')))
        return;
      // const fileName = basename(item, '.scss');

      writeFileSync(
        `${item}.d.ts`,
        `declare const styles: { [key: string]: string };
        \n\rexport default styles;`,
      );
    });
  } catch (error) {
    console.log(error);

    //
  }
})();
