const Router = require('express')
const router = new Router()
const controller = require('../controllers/category')
const authWare = require('../middleware/roleMiddleware')

router.post('/categories', authWare([3, 4]), controller.create)
router.get('/categories', authWare(), controller.get)
router.get('/categoriespages', authWare(), controller.getPages)
router.get('/categories/:id', authWare(), controller.getOne)
router.put('/categories/:id', authWare([3, 4]), controller.update)
router.delete('/categories/:id', authWare([3, 4]), controller.delete)

module.exports = router