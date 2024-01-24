const Koa = require('koa');
const Router = require('koa-router');
const { productsBySubcategory, productList, productById } = require('./controllers/products');
const { categoryList } = require('./controllers/categories');
const handleInvalidObjectId = require('./middleware/handle-invalid-object-id.middleware');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = { error: err.message };
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
});

const router = new Router({ prefix: '/api' });

router.get('/categories', categoryList);
router.get('/products', handleInvalidObjectId({ retrieveId: ctx => ctx.query.subcategory }), productsBySubcategory, productList);
router.get('/products/:id', handleInvalidObjectId(), productById);

app.use(router.routes());

module.exports = app;
