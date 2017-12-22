const Koa = require('koa')
// 注意 require('koa-router') 返回的是函数:
const router = require('koa-router')()
const app = new Koa()

 // 添加路由
 router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>index page</h1>`
})

//命名路由
router.get('user', '/users/:id', async (ctx, next)=>{
    ctx.response.body = `<h1>user:${ctx.params.id}</h1>`
});
router.url('user', 3);//生成路由/users/3

router.get('/home', async (ctx, next) => {
    ctx.response.body = '<h1>HOME page</h1>'
})

router.get('/404', async (ctx, next) => {
    ctx.response.body = '<h1>404 Not Found</h1>'
})

router.all('/*', async (ctx, next) => {
    ctx.response.status = 404;
    ctx.response.body = '<h1>404 Not Found</h1>';
})

 // 调用路由中间件
app.use(router.routes())

app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
})


