import { resolve } from 'node:path';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileExist, pathJoin, readFileToJsonSync } from 'a-node-tools';
import { isUndefined } from 'a-type-of-js';

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

/**  添加协议  */
function addLicense(dir) {
  readdirSync(dir).forEach(file => {
    /**  文件路径  */
    const filePath = pathJoin(dir, file);
    /**  文件是否存在（其实，一定存在）  */
    const isExist = fileExist(filePath);
    if (isUndefined(isExist)) return; // 不存在直接返回

    if (isExist.isDirectory()) {
      return addLicense(filePath); // 当前识别文文件夹
    }
    if (['.mjs', '.js', '.cjs', '.d.ts'].some(e => file.endsWith(e))) {
      const content = readFileSync(filePath, 'utf8');

      if (!content.includes('@license')) {
        writeFileSync(
          filePath,
          licenseHeader(filePath.replace(distDir, '').replace('/', '@')) +
            (file.endsWith('js') ? '\n"use client";\n' : '') +
            content,
        );
      } else if (file.endsWith('js')) {
        writeFileSync(filePath, '\n"use client";\n' + content);
      }
    }
  });
}

addLicense(distDir);
