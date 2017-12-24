const Koa = require('koa');
const router = require('koa-router')();
const json = require('koa-json');
const static = require('koa-static');
const path = require('path')
const app = new Koa();

const logger = require('koa-logger')

// app.use(logger())
app.use(static(path.resolve(__dirname, 'public')))


// const log4js = require('log4js');
// log4js.configure({
//     appenders: {
//         cheese: {
//             type: 'dateFile', // 日志类型 
//             filename: `logs/task`,  // 输出的文件名
//             pattern: '-yyyy-MM-dd.log',  // 文件名增加后缀
//             alwaysIncludePattern: true   // 是否总是有后缀名
//         }
//     },
//     categories: { default: { appenders: ['cheese'], level: 'error' } }
// });
// const logger = log4js.getLogger('cheese');
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

app.use(json());

router.get('/', async (ctx, next) => {
    console.log(ctx.query)
    console.log(ctx.querystring)
    ctx.body = { name: 'ht', age: 23 }
})
// router.get('/home', async(ctx, next) => {
//     console.log('query:',ctx.request.query)
//     console.log('querystring:',ctx.request.querystring)
//     ctx.response.body = '<h1>HOME page</h1>'
//   })
//   router.get('/home/:id/:name', async(ctx, next) => {
//     console.log(ctx.params)
//     ctx.response.body = '<h1>HOME page</h1>'
//   })
router.all('/*', async (ctx, next) => {
    ctx.response.status = 404;
    ctx.response.body = '<h1>404 Not Found</h1>';
})

app.use(router.routes())

app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
})