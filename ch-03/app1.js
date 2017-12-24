const Koa=require('koa');
const router=require('koa-router')();

const app=new Koa();

// router.get('/',async (ctx,next)=>{
//     ctx.response.body='<h1>Hello world</h1>'
// })
router.get('/home/:id/:name',async(ctx,next)=>{
    console.log(ctx.params)
    ctx.body=`<h1>id:${ctx.params.id}</h1><h1>name:${ctx.params.name}</h1>`
})
router.all('/*', async (ctx, next) => {
    ctx.response.status = 404;
    ctx.response.body = '<h1>404 Not Found</h1>';
})

app.use(router.routes())

app.listen(3000,()=>{
    console.log('server is running at http://localhost:3000')
})