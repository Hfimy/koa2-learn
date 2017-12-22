# koa2-learn

## 环境准备：安装node.js，建议版本号`>=7.6`，否则需额外安装插件。
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
cnpm i koa -S
```
## 一、middleware中间件
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

上述代码中，由 `async` 标记的函数称为『异步函数』，在异步函数中，可以用 `await` 调用另一个异步函数，`async` 和 `await` 这两个关键字将在 ES7 中引入。参数 `ctx` 是由 `koa` 传入的，我们可以通过它来访问 `request` 和 `response`，`next` 是 `koa` 传入的将要处理的下一个异步函数。
**这里的 `async` 函数就是我们所说的中间件，正是因为中间件的扩展性才使得 `Koa` 的代码简单灵活。**

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

## 二、路由koa-router
路由是用于描述 `URL` 与处理函数之间的对应关系的。比如用户访问 `http://localhost:3000/`，那么浏览器就会显示 `index` 页面的内容，如果用户访问的是 `http://localhost:3000/home`，那么浏览器应该显示 `home` 页面的内容。

要实现上述功能，如果不借助 `koa-router` 或者其他路由中间件，而是自己去处理路由，那么写法可能如下所示：

```js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    if (ctx.request.path === '/') {
        ctx.response.body = '<h1>index page</h1>';
    } else {
        await next();
    }
});
app.use(async (ctx, next) => {
    if (ctx.request.path === '/home') {
        ctx.response.body = '<h1>home page</h1>';
    } else {
        await next();
    }
});
app.use(async (ctx, next) => {
    if (ctx.request.path === '/404') {
        ctx.response.body = '<h1>404 Not Found</h1>';
    } else {
        await next();
    }
});

app.listen(3000, ()=>{
  console.log('server is running at http://localhost:3000')
})
```
这样的写法能够处理简单的应用，但是，一旦要处理的 `URL` 多起来的话就会显得特别笨重。所以我们可以借助 `koa-router` 来更简单的实现这一功能。
下面来介绍一下如何正确的使用 `koa-router`。
* 安装 koa-router
```js
cnpm i koa-router -S
```
* 基本使用方法

如果要在 `app1.js` 中使用 `koa-router` 来处理 `URL`，可以通过以下代码来实现：

```js
const Koa = require('koa')
// 注意 require('koa-router') 返回的是函数:
const router = require('koa-router')()
const app = new Koa()

 // 添加路由
 router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>index page</h1>`
})

router.get('/home', async (ctx, next) => {
    ctx.response.body = '<h1>HOME page</h1>'
})

router.get('/404', async (ctx, next) => {
    ctx.response.body = '<h1>404 Not Found</h1>'
})

 // 调用路由中间件
 app.use(router.routes())

app.listen(3000, ()=>{
  console.log('server is running at http://localhost:3000')
})
```
通过上面的例子，我们可以看到和之前不使用 `koa-router` 的显示效果是一样的。不过使用了 `koa-router` 之后，代码稍微简化了一些，而且少了 `if` 判断，还有省略了 `await next()`（因为没有其他中间件需要执行，所以这里就先省略了）。

当然，除了 `GET` 方法，`koa-router` 也支持处理其他的请求方法，比如：

```js
//支持这种链式写法
router
  .get('/', async (ctx, next) => {
    ctx.body = 'Hello World!';
  })
  .post('/users', async (ctx, next) => {
    // ... 
  })
  .put('/users/:id', async (ctx, next) => {
    // ... 
  })
  .del('/users/:id', async (ctx, next) => {
    // ... 
  })
  .all('/users/:id', async (ctx, next) => {
    // ... 
  });
```
上述代码中有一个`all` 方法。`all` 方法用于处理上述方法无法匹配的情况，或者你不确定客户端发送的请求方法类型。比如有一个`GET`请求，优先匹配和`router.get`方法中`url`规则一样的请求，如果匹配不到的话就匹配`router.all`方法中`url`规则一样的请求。
当请求都无法匹配的时候，我们可以跳转到自定义的 `404` 页面，比如：

```js
//这个放在路由的最后
router.all('/*', async (ctx, next) => {
  ctx.response.status = 404;
  ctx.response.body = '<h1>404 Not Found</h1>';
});
```
`*` 号是一种通配符，表示匹配任意 `URL`。这里的返回是一种简化的写法，真实开发中，我们肯定要去读取 `HTML` 文件或者其他模板文件的内容，再响应请求。关于这部分的内容后面的章节中会详细介绍。
### 其他特性
* 命名路由：在开发过程中我们能够根据路由名称和参数很方便的生成路由 `URL`：

```js
router.get('user', '/users/:id', async (ctx, next)=>{
  // ... 
});

router.url('user', 3);
// => 生成路由 "/users/3" 
 
router.url('user', { id: 3 });
// => 生成路由 "/users/3" 
 
router.use(async (ctx, next) {
  // 重定向到路由名称为 “sign-in” 的页面 
  ctx.redirect(ctx.router.url('sign-in'));
})
```
`router.url` 方法方便我们在代码中根据路由名称和参数(可选)去生成具体的 `URL`，而不用采用字符串拼接的方式去生成 `URL` 了。

* 多中间件：`koa-router` 也支持单个路由多中间件的处理。通过这个特性，我们能够为一个路由添加特殊的中间件处理。也可以把一个路由要做的事情拆分成多个步骤去实现，当路由处理函数中有异步操作时，这种写法的可读性和可维护性更高。比如下面的示例代码所示：

```js
router.get(
    '/users/:id',
    async (ctx, next) => {
        ctx.body=`<h1>user:${ctx.params.id}</h1>`;
        ctx.user='xiaoming';
        next();
    },
    async (ctx, next) => {
        console.log(ctx.user);
        // 在这个中间件中再对用户信息做一些处理
        // => { id: 17, name: "Alex" }
    }
);
```

* 嵌套路由：我们可以在应用中定义多个路由，然后把这些路由组合起来用，这样便于我们管理多个路由，也简化了路由的写法。
```js
const Router=require('koa-router')

const forums = new Router();
const posts = new Router();
 
posts.get('/', async (ctx, next)=>{
    ctx.body=`fid:${ctx.params.fid}`
});
posts.get('/:pid', async (ctx, next)=>{
    ctx.body=`pid:${ctx.params.pid}`
});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());
 
// 可以匹配到的路由为 "/forums/123/posts" 或者 "/forums/123/posts/123"
app.use(forums.routes());
```
* 路由前缀：通过 `prefix` 这个参数，我们可以为一组路由添加统一的前缀，和嵌套路由类似，也方便我们管理路由和简化路由的写法。不同的是，前缀是一个固定的字符串，不能添加动态参数。

```js
const Router=require('koa-router')
const router = new Router({
  prefix: '/users'
});
 
router.get('/', ...); // 匹配路由 "/users" 
router.get('/:id', ...); // 匹配路由 "/users/:id" 
```
一般在更新版本号的时候很方便。
* URL 参数：`koa-router` 也支持参数，参数会被添加到 `ctx.params` 中。参数也可以是一个正则表达式，这个功能的实现是通过 `path-to-regexp` 来实现的。原理是把 `URL` 字符串转化成正则对象，然后再进行正则匹配，之前的例子中的 `*` 通配符就是一种正则表达式。

```js
router.get('/:category/:title', function (ctx, next) {
  console.log(ctx.params);
  // => { category: 'programming', title: 'how-to-node' } 
});
```