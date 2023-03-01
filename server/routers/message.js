const Router = require('express')
const router = new Router()
const controller = require('../controllers/message')
const authWare = require('../middleware/roleMiddleware')

router.post('/messages', authWare(), controller.create)
router.get('/messages/:ticketId', authWare(), controller.get)
router.get('/messages/:id', authWare(), controller.getOne)

module.exports = router