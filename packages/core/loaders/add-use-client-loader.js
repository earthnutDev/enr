/**
 *  打包时候向文件头添加  'use client';
 * @param source
 */
export default function (source) {
  if (
    !source.trimStart().startsWith("'use client'") &&
    !source.trimStart().startsWith('"use client"')
  )
    return "/*@__NOINLINE__*/ 'use client';\n\n" + source;

  return source;
}
