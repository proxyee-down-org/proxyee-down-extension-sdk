# Proxyee Down 扩展开发 SDK

把[扩展开发 API](https://github.com/proxyee-down-org/proxyee-down-extension#api)全部封装成`Promise`对象，已便于用`es6`语法进行开发。

## 安装

```
npm install proxyee-down-extension-sdk
```

## 使用

```js
import api from "proxyee-down-extension-sdk";

//es5
api
  .createTask({})
  .then(result => console.log(result))
  .catch(error => console.log(error));

//es6
async function click() {
  try {
    const result = await api.createTask({});
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
```

## API

方法名 | 参数 | 说明
---|---|---
resolve | (request) | 根据请求解析出响应的相关信息(大小、文件名、是否支持断点下载)
createTask | (taskForm) | 创建一个任务，会唤醒 proxyee-down 并弹出下载框
pushTask | (taskForm, onSuccess, onError) | 创建一个任务，不弹下载框直接在后台下载
getDownConfig | () | 取下载相关配置信息
getCookie | (url) | 取目标网站的cookie，需要被代理服务器访问才能生效