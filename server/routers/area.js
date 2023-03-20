const Router = require("express");
const router = new Router();
const controller = require("../controllers/area");
const authWare = require("../middleware/roleMiddleware");

router.post("/areas", authWare([3, 4]), controller.create);
router.get("/areas", authWare(), controller.get);
router.get("/areaspages", authWare(), controller.getPages);
router.get("/areasbyuser", authWare(), controller.getByUser);
router.get("/areas/:id", authWare(), controller.getOne);
router.put("/areas/:id", authWare([3, 4]), controller.update);
router.delete("/areas/:id", authWare([3, 4]), controller.delete);

module.exports = router;
