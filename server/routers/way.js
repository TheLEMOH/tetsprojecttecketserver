const Router = require('express')
const router = new Router()
const controller = require('../controllers/way')
const authWare = require('../middleware/roleMiddleware')

router.post('/ways', authWare([3, 4]), controller.create)
router.get('/ways', authWare(), controller.get)
router.get('/wayspages', authWare([2, 3, 4]), controller.getPages)
router.get('/ways/:id', authWare(), controller.getOne)
router.put('/ways/:id', authWare([3, 4]), controller.update)
router.delete('/ways/:id', authWare([3, 4]), controller.delete)


module.exports = router