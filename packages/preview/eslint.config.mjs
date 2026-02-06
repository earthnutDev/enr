/**
 * @module @reset-new-tab/rollup.config
 * @file eslint.config.js
 * @description eslint 配置文件
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-02-06 06:17
 * @version 0.1.4
 * @lastModified 2026-02-06 06:18
 */

import { initializeFile } from 'a-node-tools';
import { eslintConfigBase } from '../../eslint.config.base.js';

export default eslintConfigBase(initializeFile()[1]);
