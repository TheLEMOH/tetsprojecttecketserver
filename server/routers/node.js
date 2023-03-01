const Router = require('express')
const router = new Router()
const controller = require('../controllers/node')

router.post('/nodes', controller.create)
router.get('/nodes', controller.get)
router.get('/nodes/:id', controller.getOne)
module.exports = router