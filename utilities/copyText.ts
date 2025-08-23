/**
 * @Author earthnut
 * @Email earthnut.dev@outlook.com
 * @ProjectName website
 * @FileName copyText.ts
 * @CreateDate  周四  12/19/2024
 * @Description 复制文本到剪切板
 */

declare global {
  const clipboardData: {
    /**
     * 清空当前的剪切板
     **/
    clearData(): void;
    /**
     * 设置新的剪切板数据
     **/
    setData(arg0: 'Text', arg1: string): void;
  };
}

export default function copyText(text: string) {
  const { clipboard } = navigator;
  /** 新式写法 */
  if (clipboard && clipboard.writeText) {
    clipboard.writeText(text);
  } else if (
    clipboardData &&
    clipboardData.clearData &&
    clipboardData.setData
  ) {
    /**
     * IE 大哥
     *
     * 该值 `clipboardData` 存在于 window 上
     **/
    clipboardData.clearData();
    clipboardData.setData('Text', text);
  } else if (document.execCommand) {
    /*  旧式写法*/
    const hover = document.createElement('input');
    hover.value = text;
    document.body.appendChild(hover);
    hover.select();
    document.execCommand('Copy');
    hover.className = 'hover';
    hover.style.display = 'none';
  }
}
