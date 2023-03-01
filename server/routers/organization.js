const Router = require('express')
const router = new Router()
const controller = require('../controllers/organization')
const authWare = require('../middleware/roleMiddleware')

router.post('/organizations', authWare([3, 4]), controller.create)
router.get('/organizations', controller.get)
router.get('/organizationspages', authWare(), controller.getPages)
router.get('/organizations/:id', authWare(), controller.getOne)
router.put('/organizations/:id', authWare([3, 4]), controller.update)
router.delete('/organizations/:id', authWare([3, 4]), controller.delete)

module.exports = router