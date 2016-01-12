# YoudaoDict

```shell
npm install
npm run build
```

自制有道词典 Chrome 扩展，使用[有道词典 api](http://fanyi.youdao.com/openapi)

## 安装

* 去 [Chrome 官方商店](https://chrome.google.com/webstore/detail/youdao-dict/geboigdomoihijcamklnhlcgnnpdgkmg)安装。
* 下载 [crx 文件](https://github.com/youngdze/YoudaoDict/releases)安装。

## 开发

```shell
npm run dev
```
## Test

```shell
curl http://selenium-release.storage.googleapis.com/2.48/selenium-server-standalone-2.48.2.jar --create-dirs -o bin/selenium-server-standalone.jar
npm run webdriver
# set up another shell
npm run test
```

在 Chrome 扩展页面点击载入开发中的扩展，选择 `build` 目录。

## 功能

* 点击扩展图标输入进行翻译
* 双击或按 Ctrl 对选择区域进行翻译
* 添加生词至有道单词本

## 版权

* DO WHATEVER YOU WANT
