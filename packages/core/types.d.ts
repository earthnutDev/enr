declare module '*.module.scss' {
  const classes: {
    [key: string]: string;
  };
  export default classes;
}

// 声明单张图片
declare module 'default.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// 如果需要处理 CSS 模块
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
