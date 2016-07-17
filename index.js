const Koa = require('koa')
const KoaStatic = require('koa-static')
const Router = require('koa-router')
const KoaBody = require('koa-body')

const fightApi = require('./api/fight.js')
const userApi = require('./api/user.js')
const items = require('./items.js')
const game = require('./game.js')
const admin = require('./admin.js')
const Player = require('./player.js')

const app = new Koa()

app.use(function * (next) {
  try {
    yield next
  } catch (err) {
    console.log(err)
    this.status = err.status || 500
    this.body = err.message
    this.app.emit('error', err, this)
  }
})

app.use(KoaStatic('./front'))

app.use(function * (next) {
  this.set('Access-Control-Allow-Origin', '*')
  yield next
})

const router = new Router({
  prefix: '/api'
})

const koaBody = new KoaBody()

function * auth (next) {
  const key = this.request.header.key
  this.player = yield Player.find(key)

  if (this.player) {
    yield next
  } else {
    this.throw(401)
  }
}

router.get('/fight/:a/:b', fightApi.fight)
router.post('/user/login', koaBody, userApi.login)
router.post('/user/register', koaBody, userApi.register)
router.get('/game/inventory', koaBody, auth, game.inventory)
router.post('/admin/spawnitem', koaBody, auth, admin.spawnitem)

router.get('/data/items', function * () {
  this.body = items
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
