const Router = require('koa-router');
const Core = require('./model');
const { auth, authz, cache } = require('../../../middleware');

const router = new Router({
  prefix: '/cores',
});

function getAllCores() {
  router.get('/', cache(300), async (ctx) => {
    try {
      const result = await Core.find({});
      ctx.status = 200;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function getOneCore() {
  router.get('/:id', cache(300), async (ctx) => {
    const result = await Core.findById(ctx.params.id);
    if (!result) {
      ctx.throw(404);
    }
    ctx.status = 200;
    ctx.body = result;
  });
}

function queryCores() {
  router.post('/query', cache(300), async (ctx) => {
    const { query = {}, options = {} } = ctx.request.body;
    try {
      const result = await Core.paginate(query, options);
      ctx.status = 200;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function createCore() {
  router.post('/', auth, authz('core:create'), async (ctx) => {
    try {
      const core = new Core(ctx.request.body);
      await core.save();
      ctx.status = 201;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function updateCore() {
  router.patch('/:id', auth, authz('core:update'), async (ctx) => {
    try {
      await Core.findByIdAndUpdate(ctx.params.id, ctx.request.body, { runValidators: true });
      ctx.status = 200;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function deleteCore() {
  router.delete('/:id', auth, authz('core:delete'), async (ctx) => {
    try {
      await Core.findByIdAndDelete(ctx.params.id);
      ctx.status = 200;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

getAllCores();
getOneCore();
queryCores();
updateCore();
createCore();
deleteCore();

module.exports = router;
