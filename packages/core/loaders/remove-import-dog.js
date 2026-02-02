/**
 *  移除打印狗
 * @param source
 */
export default function (source) {
  const withDogRegExp = /import\s+\{?\s*dog\s*\}*\s+from\s+['"]dog['"];?/g;
  return (withDogRegExp.test(source) && source.replace(withDogRegExp, '')) || source;
}
