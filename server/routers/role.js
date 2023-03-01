const Router = require('express')
const router = new Router()
const controller = require('../controllers/role')
const authWare = require('../middleware/roleMiddleware')

router.get('/roles', authWare(), controller.get)
router.get('/rolespages', authWare(), controller.getPages)

module.exports = router