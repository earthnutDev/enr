/**
 * @module @enr/build-css
 * @file build-css.js
 * @description 构建 css
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-28 14:01
 * @version 2.0.0-alpha.0
 * @lastModified 2026-01-29 18:30
 */

import { writeFileSync } from 'node:fs';
import { runOtherCode } from 'a-node-tools';

/** 前置编译 */
const preDone = globalThis?.process?.argv[2] === 'pre';

const sass = 'pnpm exec sass --no-source-map --style=compressed ';

const writeCssTo = str => `src/customHooks/use-xcn/${str}.ts`;

/**
 * ## 构建预发布数据
 */
async function buildPre() {
  const css = await runOtherCode(`${sass} src/css/common.scss`);

  if (css.success && css.data) {
    writeFileSync(writeCssTo('css'), `export const GLOBAL_CSS = '${css.data.replace(/\s+$/, '')}'`);
  }

  const resetCss = await runOtherCode(`${sass} src/css/reset.scss`);

  if (resetCss.success && resetCss.data) {
    writeFileSync(
      writeCssTo('reset-css'),
      `export const RESET_CSS = '${resetCss.data.replace(/\s+$/, '')}'`,
    );
  }
}

/**
 *
 */
async function build() {
  await runOtherCode(`${sass} src/css/common.scss dist/styles/common.css`);
  await runOtherCode(`${sass} src/css/reset.scss dist/styles/reset.css`);
}

if (preDone) {
  await buildPre();
} else {
  await build();
}
