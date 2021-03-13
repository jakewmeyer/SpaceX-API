const Router = require('koa-router');
const Landpad = require('./model');
const { auth, authz, cache } = require('../../../middleware');

const router = new Router({
  prefix: '/landpads',
});

function getAllLandpads() {
  router.get('/', cache(300), async (ctx) => {
    try {
      const result = await Landpad.find({});
      ctx.status = 200;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function getOneLandpad() {
  router.get('/:id', cache(300), async (ctx) => {
    const result = await Landpad.findById(ctx.params.id);
    if (!result) {
      ctx.throw(404);
    }
    ctx.status = 200;
    ctx.body = result;
  });
}

function queryLandpads() {
  router.post('/query', cache(300), async (ctx) => {
    const { query = {}, options = {} } = ctx.request.body;
    try {
      const result = await Landpad.paginate(query, options);
      ctx.status = 200;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function createLandpad() {
  router.post('/', auth, authz('landpad:create'), async (ctx) => {
    try {
      const landpad = new Landpad(ctx.request.body);
      await landpad.save();
      ctx.status = 201;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function updateLandpad() {
  router.patch('/:id', auth, authz('landpad:update'), async (ctx) => {
    try {
      await Landpad.findByIdAndUpdate(ctx.params.id, ctx.request.body, { runValidators: true });
      ctx.status = 200;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function deleteLandpad() {
  router.delete('/:id', auth, authz('landpad:delete'), async (ctx) => {
    try {
      await Landpad.findByIdAndDelete(ctx.params.id);
      ctx.status = 200;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

getAllLandpads();
getOneLandpad();
queryLandpads();
createLandpad();
updateLandpad();
deleteLandpad();

module.exports = router;
