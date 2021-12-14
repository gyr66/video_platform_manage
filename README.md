# kelikeli
## 测试
### 地址问题 <font color=gree>通过</font>
1. axios BASE_URL <font color=gree>局域网环境通过</font> <font color=gree>本地环境通过</font>
2. Player 请求decrypt <font color=gree>局域网环境通过</font> <font color=gree>本地环境通过</font>
3. Tus上传 <font color=gree>局域网环境通过</font> <font color=gree>本地环境通过</font>
4. 缩略图上传 <font color=gree>局域网环境通过</font> <font color=gree>本地环境通过</font>

### 上传文件测试 <font color=gree>通过</font>
1. 在预上传阶段直接关闭窗口（浏览器） <font color=gree>通过</font>
2. 在开始上传时关闭浏览器（所有均未完成）<font color=gree>通过</font>
3. 在开始上传时关闭浏览器（部分已完成） <font color=gree>通过</font>

## TODO
1. 制作远程资源获取任务列表
2. ~~增加文件重复可选项~~（已完成）

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
