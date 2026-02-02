/**
 *  文件首添加 import React
 * @param source
 */
export default function (source) {
  return (
    (['jsx', 'tsx'].some(e => this.resourcePath.endsWith(e)) &&
      !/import\s+React\s+from\s+['"]react['"]/.test(source) &&
      `import React from 'react';\n\n${source}`) ||
    source
  );
}
