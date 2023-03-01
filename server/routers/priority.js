const Router = require('express')
const router = new Router()
const controller = require('../controllers/priority')
const authWare = require('../middleware/roleMiddleware')

router.get('/priorities', authWare(), controller.get)
router.get('/prioritiespages', authWare(), controller.getPages)

module.exports = router