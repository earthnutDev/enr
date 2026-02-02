/**
 * @packageDocumentation
 * @module @enr/before-push-version
 * @file before-push-version.js
 * @description  执行 push:version 钩子前执行
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-19 21:01
 * @version 2.0.0-alpha.0
 * @lastModified 2026-01-26 11:45
 */
import { dun } from 'zza/log';

const isProduct = globalThis?.process?.env?.NODE_ENV === 'production' || false;

console.log('hello');

if (dun || isProduct) {
  console.log('当前依赖包为测试环境，禁止执行 push:version 钩子');
  process.exit(1);
}
