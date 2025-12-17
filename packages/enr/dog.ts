import { Dog } from '@qqi/log';
/**  开发环境执行，该方法在 env === 'production' 时通过 babel 和 webpack 过滤移除  */
export const dog = new Dog({
  name: 'enr',
  type: true,
});
