import { pathJoin, readFileToJsonSync, getDirectoryBy, writeJsonFile } from 'a-node-tools';

let packageJson = readFileToJsonSync('./package.json');

['scripts', 'devDependencies', 'lint-staged', 'private', 'override'].forEach(
  key => delete packageJson[key],
);

packageJson = {
  // main: 'index.cjs',
  module: 'index.mjs',
  types: 'index.d.ts',
  author: {
    name: '🥜',
    email: 'earthnut.dev@outlook.com',
    url: 'https://earthnut.dev',
  },
  ...packageJson,
  files: [
    'styles',
    'type',
    'client.mjs',
    // 'client.mjs.map',
    'index.mjs',
    'layoutUtil.mjs',
    // 'layoutUtil.mjs.map',
    'server.mjs',
    // 'server.mjs.map',
  ],
  exports: {
    '.': {
      types: './type/index.d.ts',
      import: './index.mjs',
      default: './index.mjs',
    },
    ...getExport(['client', 'server'], {
      types: `./type/index.#.d.ts`,
      import: `./#.mjs`,
      default: `./#.mjs`,
    }),
    ...getExport(['common.scss', 'common.css', 'reset.scss', 'reset.css'], {
      types: `./styles/index.#.d.ts`,
      import: `./styles/#`,
      default: `./styles/#`,
    }),
    ...getExport(['scss', 'css'], {
      types: `./styles/common.#.d.ts`,
      import: `./styles/common.#`,
      default: `./styles/common.#`,
    }),
  },
  keywords: ['enr'],
  homepage: 'https://earthnut.dev/quickUse',
  bugs: {
    url: 'https://github.com/earthnutDev/enr/issues',
    email: 'earthnut.dev@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/earthnutDev/enr.git',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  license: 'MIT',
  peerDependencies: {
    react: '>= 17',
    'react-dom': '>= 17',
    'styled-components': '>= 6',
  },
  // 用作 tree-shaking 标记
  sideEffects: false,
};
{
  const distPath = getDirectoryBy('src', 'directory');

  const distPackagePath = pathJoin(distPath, './dist/package.json');

  writeJsonFile(distPackagePath, packageJson);
}

/**
 *
 */
function getExport(target, _export) {
  const _keys = Object.keys(_export);

  return Object.fromEntries([
    ...target.map(e => [
      './' + e,
      Object.fromEntries([..._keys.map(key => [key, _export[key].replace('#', e)])]),
    ]),
  ]);
}
