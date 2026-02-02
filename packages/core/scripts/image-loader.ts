/**
 * @packageDocumentation
 * @module @enr/image-loader
 * @file image-loader.ts
 * @description base64
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-20 11:51
 * @version 2.0.0-alpha.0
 * @lastModified 2026-01-20 11:55
 */

export const loadImageAsBase64 = (path: string): Promise<string> =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = path;
  });
