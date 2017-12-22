# koa2-learn

## 一、环境准备：安装node.js，建议版本号大于`7.6`，否则需额外安装插件。
<br>

  - 直接安装 node.js ：node.js官网地址 [https://nodejs.org](https://nodejs.org)
  - nvm管理多版本 node.js ：可以用nvm 进行node版本进行管理
      - Mac 系统安装 nvm [https://github.com/creationix/nvm#manual-install](https://github.com/creationix/nvm#manual-install)
      - windows 系统安装 nvm [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
      - Ubuntu 系统安装 nvm [https://github.com/creationix/nvm](https://github.com/creationix/nvm)

<br>

* 新建项目，使用`npm init`初始化，目录如下
```txt
├── app.js
├── package.json
```
* 安装 koa，并将版本信息保存在 package.json 中
```js
npm i koa -S
```
## 二、middleware中间件
在HelloWorld的demo中，代码如下

```js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx,next) => {
  await next()
  ctx.body = 'Hello World';
});

app.listen(3000);
``` 
它的作用是：每收到一个 `http` 请求，`Koa` 都会调用通过 `app.use()` 注册的 `async` 函数，同时为该函数传入 `ctx` 和 `next` 两个参数，最后给页面返回一个`Hello World'.
<br>

**这里的 `async` 函数就是我们所说的中间件。正是因为中间件的扩展性才使得 `Koa` 的代码简单灵活。**

<br>
下面我们简单介绍一下传入中间件的两个参数。

* ctx : `ctx` 作为上下文使用，包含了基本的 `ctx.request` 和 `ctx.response`。另外，还对 `Koa` 内部一些常用的属性或者方法做了代理操作，使得我们可以直接通过 `ctx` 获取。比如，`ctx.request.url` 可以写成 `ctx.url`。  --  除此之外，`Koa` 还约定了一个中间件的存储空间 `ctx.state`。通过 `state` 可以存储一些数据，比如用户数据，版本信息等。如果你使用 `webpack` 打包的话，可以使用中间件，将加载资源的方法作为 `ctx.state` 的属性传入到 `view` 层，方便获取资源路径。

* next : `next` 参数的作用是将处理的控制权转交给下一个中间件，而 `next()` 后面的代码，将会在下一个中间件及后面的中间件（如果有的话）执行结束后再执行。

**所以： 中间件的顺序很重要！**
```js
// 按照官方示例
const Koa = require('koa')
const app = new Koa()

// 记录执行的时间
app.use(async (ctx, next) => {
  let stime = new Date().getTime()
  await next()
  let etime = new Date().getTime()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1>Hello World</h1>'
  console.log(`请求地址: ${ctx.path}，响应时间：${etime - stime}ms`)
});

app.use(async (ctx, next) => {
  console.log('中间件1 doSoming')
  await next();
  console.log('中间件1 end')
})

app.use(async (ctx, next) => {
  console.log('中间件2 doSoming')
  await next();
  console.log('中间件2 end')
})

app.use(async (ctx, next) => {
  console.log('中间件3 doSoming')
  await next();
  console.log('中间件3 end')
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
``` 
运行起来后，控制台显示： 

```txt
server is running at http://localhost:3000
``` 

<br> 

然后打开浏览器，访问 `http://localhost:3000`，控制台显示内容更新为： 

```txt
server is running at http://localhost:3000
中间件1 doSoming
中间件2 doSoming
中间件3 doSoming
中间件3 end
中间件2 end
中间件1 end
请求地址: /，响应时间：2ms
```
从结果上可以看到，流程是一层层的打开，然后一层层的闭合，像是剥洋葱一样 —— 洋葱模型。

此外，如果一个中间件没有调用 `await next()`，会怎样呢？答案是『后面的中间件将不会执行』。 如果`await next()`后面没有中间件了，那么也将结束执行。