import { readdirSync } from 'node:fs';
import { basename, extname } from 'node:path';
import {
  pathJoin,
  getDirectoryBy,
  writeJsonFileSync,
  fileExist,
  getPackageJson,
} from 'a-node-tools';

const isProduction = globalThis?.process?.env?.NODE_ENV === 'production';
console.log(globalThis.process.env.NODE_ENV);
// 原始 package.json 内容
let packageJsonContext = await getPackageJson();

if (!packageJsonContext?.content)
  throw new RangeError('未能捕获到 package.json 文件');

let packageJson = packageJsonContext.content;

delete packageJson.exports; // 移除旧的构建导出

// 移除冗余的键
const esPrefix = 'dist/es'; // es 前缀
const cjsPrefix = 'dist/cjs'; // cjs 前缀
const dtsPrefix = 'dist/es/types'; // 类型文件的前缀
// <--  !!! -->
// <--  !!! -->
// <--  !!! -->
// 查看当前的源码文件路径（原则上与上面值一致）
const srcParentDirectory = getDirectoryBy('src', 'directory');
// 当前 src 的路径
const srcDirectory = pathJoin(srcParentDirectory, 'src');
// src 目录下的文件列表
const srcChildrenList = readdirSync(srcDirectory);
// 打包的 exports
const exportsList = {};

for (const childrenName of srcChildrenList) {
  // 如果是测试文件则跳过
  if (
    // 剔除测试文件
    childrenName.endsWith('.test.ts') ||
    // 剔除单独配置的根文件
    childrenName.endsWith('index.ts') ||
    childrenName.endsWith('utils') ||
    childrenName.includes(isProduction ? 'log-development' : 'log-production')
  )
    continue;
  // 文件名（不带后缀）
  const childrenBaseName = basename(childrenName, extname(childrenName));
  // 统一 dog、dun 的导入
  const exportName = childrenBaseName.startsWith('log-')
    ? 'log'
    : childrenBaseName;
  // console.log(isProduction, exportName, childrenBaseName);
  // 子文件/夹的路径
  const childPath = pathJoin(srcDirectory, childrenName);

  const childFile = fileExist(childPath); // 文件元数据
  if (!childFile) throw new RangeError(`${childrenName} 文件未能读取`);
  // 子文件是文件夹时以 index.xxx.js 为准
  if (childFile.isDirectory()) {
    exportsList[`./${exportName}`] = {
      default: `./${esPrefix}/${childrenName}/index.js`,
      import: `./${esPrefix}/${childrenName}/index.js`,
      require: `./${cjsPrefix}/${childrenName}/index.js`,
      types: `./${dtsPrefix}/${childrenName}/index.d.ts`,
    };
  } else if (childFile.isFile()) {
    exportsList[`./${exportName}`] = {
      default: `./${esPrefix}/${childrenBaseName}.js`,
      import: `./${esPrefix}/${childrenBaseName}.js`,
      require: `./${cjsPrefix}/${childrenBaseName}.js`,
      types: `./${dtsPrefix}/${childrenBaseName}.d.ts`,
    };
  } else {
    throw new RangeError(`${childrenName} 文件类型不符合要求`);
  }
}

packageJson = {
  // main: cjsPrefix + '/index.js', // 旧版本 CommonJs 入口
  // module: esPrefix + '/index.js', // 旧版本 ESM 入口
  // types: dtsPrefix + '/index.d.ts', // 旧版本类型入口
  author: {
    name: '泥豆君',
    email: 'Mr.MudBean@outlook.com',
    url: 'https://lmssee.com',
  },
  description: 'enr 内部共享方法',
  sideEffects: false, // 核心：开启 Tree Shaking
  ...packageJson,
  exports: {
    '.': {
      import: `./${esPrefix}/index.js`,
      default: `./${esPrefix}/index.js`,
      require: `./${cjsPrefix}/index.js`,
      types: `./${dtsPrefix}/index.d.ts`,
    },
    ...exportsList,
  },
};

{
  // 写入新的 packages.json 文件
  writeJsonFileSync(packageJsonContext.path, packageJson);
}
