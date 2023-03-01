const Router = require('express')
const router = new Router()
const controller = require('../controllers/system')
const authWare = require('../middleware/roleMiddleware')

router.get('/system', authWare(), controller.getOne)
router.put('/system/:id', authWare([3, 4]), controller.update)
router.delete('/system/:id', authWare([3, 4]), controller.delete)

module.exports = router