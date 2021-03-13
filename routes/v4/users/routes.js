const Router = require('koa-router');
const User = require('./model');
const { auth, authz } = require('../../../middleware');

const router = new Router({
  prefix: '/users',
});

function getAllUsers() {
  router.get('/', auth, authz('user:list'), async (ctx) => {
    try {
      const result = await User.find({});
      ctx.status = 200;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function getOneUser() {
  router.get('/:id', auth, authz('user:one'), async (ctx) => {
    const result = await User.findById(ctx.params.id);
    if (!result) {
      ctx.throw(404);
    }
    ctx.status = 200;
    ctx.body = result;
  });
}

function queryUsers() {
  router.post('/query', auth, authz('user:query'), async (ctx) => {
    const { query = {}, options = {} } = ctx.request.body;
    try {
      const result = await User.paginate(query, options);
      ctx.status = 200;
      ctx.body = result;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function createUser() {
  router.post('/', auth, authz('user:create'), async (ctx) => {
    try {
      const user = new User(ctx.request.body);
      await user.save();
      ctx.status = 201;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function updateUser() {
  router.patch('/:id', auth, authz('user:update'), async (ctx) => {
    try {
      await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
        runValidators: true,
      });
      ctx.status = 200;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

function deleteUser() {
  router.delete('/:id', auth, authz('user:delete'), async (ctx) => {
    try {
      await User.findByIdAndDelete(ctx.params.id);
      ctx.status = 200;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  });
}

getAllUsers();
getOneUser();
queryUsers();
createUser();
updateUser();
deleteUser();

module.exports = router;
