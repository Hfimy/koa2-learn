const Koa = require('koa');
const router = require('koa-router')();
const bodyparser = require('koa-bodyparser');
const app = new Koa();

app.use(bodyparser());
// router.get('/',async (ctx,next)=>{
//     ctx.response.body='<h1>Hello world</h1>'
// })
router.get('/user', async (ctx, next) => {
    console.log(ctx.params)
    ctx.body =
        `
    <form action='/user/register' method='post'>
        <input name='name' type='text' placeholder='请输入用户名'/>
        <input name='password' type='password' placeholder='请输入密码'/>
        <button type='submit'>注册</button>
    </form>
    `
})

router.post('/user/register',async(ctx,next)=>{
    const {name,password}=ctx.request.body;
    console.log(name,password)
    ctx.body=`恭喜您，${name}，注册成功了！`
})
router.all('/*', async (ctx, next) => {
    ctx.response.status = 404;
    ctx.response.body = '<h1>404 Not Found</h1>';
})

app.use(router.routes())

app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
})