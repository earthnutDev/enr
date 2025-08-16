#!/bin/bash


# 定义一个数组，传入的参数必须是其中之一
array=("cjs" "mjs" "umd")
# 判断是否为其中的值
found=0

# 执行打包
build() {
  # node ./scripts/build-env.js $1

  if  ! pnpm exec webpack --config webpack.config.$1.js; then 
    exit 1
  fi 
}

# 校验参数
test_param() {
  local found=false
  for element in "${array[@]}"; do 
    if [ "$element" = "$1" ]; then
       found=true
       break
    fi  
  done

  if [ $found = true ]; then 
      build "$1";
   else
      echo "参数必须是下列参数之一"
      echo 
      echo "${array[@]}"
      echo 
      echo -e  "而 \e[31m $1 \e[m错误的参数"
      exit 1
  fi
}

buildResult() {
  # 清空dist
  pnpm exec jja rm dist 
  
  # 校验参数
  # for param in "$@"; do 
  #   test_param "$param"
  # done
  
  for element in "${array[@]}"; do 
    printf "\n\e[34m------ ${element} start -----\e[m\n\n" 
    build "$element"
    printf "\n\e[34m------ ${element} over -----\e[m\n\n" 
    sleep 1
  done

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