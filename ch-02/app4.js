const Koa = require('koa')
// 注意 require('koa-router') 返回的是函数:
const Router=require('koa-router')
const router = require('koa-router')()
const app = new Koa()


//嵌套路由
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

app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
})


