#!/bin/bash

buildResult() {
  # 清空dist
  pnpm jja rm dist 

  if  ! pnpm webpack --config webpack.config.mjs.js; then 
    exit 1
  fi 
 
  node ./scripts/clean-package-json.js 

  printf "\e[32m➠  构建类型\e[m\n" 
  # 编译 ts
  pnpm exec tsc -p tsconfig.build.json 

  printf "\n\e[32m➠  类型构建完毕\e[m\n" 
  sleep  1

  printf "\e[35m➠  构建 css \e[m\n" 
  # 编译 sass
  pnpm build:scss
  printf "\e[35m➠  css 构建完毕\e[m\n" 
}
 
 # 构建
 buildResult 

 node ./scripts/build-license.js