const Router = require('express')
const router = new Router()
const controller = require('../controllers/ticket')
const authWare = require('../middleware/roleMiddleware')

router.post('/tickets', authWare(), controller.create)
router.get('/tickets/pages', authWare(), controller.getPages)
router.get('/tickets/:id', authWare(), controller.getOne)
router.put('/tickets/:id', authWare([3, 4]), controller.update)
router.put('/ticketnextstep/:id', authWare([2, 3, 4]), controller.nextstep)
router.put('/ticketpreviousstep/:id', authWare([2, 3, 4]), controller.previousstep)
router.put('/ticketclose/:id', authWare(), controller.close)

router.get('/openedtickets', authWare([2, 3, 4]), controller.getByStatus)
router.get('/closedtickets', authWare([2, 3, 4]), controller.getByStatus)
router.get('/mytickets/:userId', authWare(), controller.getMyTickets)

module.exports = router