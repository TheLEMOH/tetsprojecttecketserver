const Router = require('express')
const router = new Router()
const controller = require('../controllers/statistic')
const authWare = require('../middleware/roleMiddleware')

router.get('/statistic', authWare([2, 3, 4]), controller.get)

module.exports = router