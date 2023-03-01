const Router = require('express')
const router = new Router()
const controller = require('../controllers/status')
const authWare = require('../middleware/roleMiddleware')

router.post('/statuses', authWare([3, 4]), controller.create)
router.get('/statuses', authWare(), controller.get)
router.get('/statusespages', authWare(), controller.getPages)
router.get('/statuses/:id', authWare(), controller.getOne)
router.put('/statuses/:id', authWare([3, 4]), controller.update)
router.delete('/statuses/:id', authWare([3, 4]), controller.delete)

module.exports = router