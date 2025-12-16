import { pathJoin, readFileToJsonSync, getDirectoryBy, writeJsonFile } from 'a-node-tools';
import process from 'node:process';

// 他包到其他名包

const newName = process.argv[2];

let packageJson = readFileToJsonSync('./dist/package.json');

packageJson.name = newName;

if (newName === 'oops-ui') packageJson.description += '，既然可以使用 oops-ui 导入，建议使用 enr ';

packageJson.keywords.push(newName);

{
  const distPath = getDirectoryBy('dist', 'directory');

  const distPackagePath = pathJoin(distPath, './dist/package.json');

  writeJsonFile(distPackagePath, packageJson);
}
