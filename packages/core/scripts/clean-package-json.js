import { pathJoin, readFileToJsonSync, writeJsonFileSync } from 'a-node-tools';

let packageJson = readFileToJsonSync('./package.json');

['scripts', 'devDependencies', 'lint-staged', 'private', 'overrides','exports'].forEach(
  key => delete packageJson[key],
);

packageJson = {
  ...packageJson,
  main: 'cjs/index.js',
  module: 'es/index.js',
  types: 'es/src/index.d.ts',
  author: {
    name: '泥豆君',
    email: 'Mr.MudBean@outlook.com',
    url: 'https://lmssee.com',
  },
  files: ['styles', 'cjs', 'es', 'LICENSE', 'README.md'],

  keywords: ['enr'],
  homepage: 'https://lmssee.com/quickUse',
  bugs: {
    url: 'https://github.com/MrMudBean/enr/issues',
    email: 'Mr.MudBean@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/MrMudBean/enr.git',
    directory: 'packages/core',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  license: 'MIT',
    "exports": {
    ".": {
      "default": "./es/index.js",
      "require": "./cjs/index.js",
      "import": "./es/index.js",
      "types": "./es/src/index.d.ts"
    },
    "./common.scss": "./styles/common.scss",
    "./common.css": "./styles/common.css",
    "./reset.scss": "./styles/reset.scss",
    "./reset.css": "./styles/reset.css",
    "./styles/common.scss": "./styles/common.scss",
    "./styles/common.css": "./styles/common.css",
    "./styles/reset.scss": "./styles/reset.scss",
    "./styles/reset.css": "./styles/reset.css"
  }
};

{
  // 整理打包后 package.json 文件路径
  const distPackagePath = pathJoin('./dist/package.json');
  // 写入新的 packages.json 文件
  writeJsonFileSync(distPackagePath, packageJson);
}
