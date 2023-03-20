const Router = require("express");
const router = new Router();
const controller = require("../controllers/folder");
const authWare = require("../middleware/roleMiddleware");

router.post("/folders", authWare([2, 3, 4]), controller.create);
router.get("/folders", authWare([1, 2, 3, 4]), controller.get);
router.get("/folderspages", authWare([2, 3, 4]), controller.getPages);
router.get("/folders/:id", authWare([2, 3, 4]), controller.getOne);
router.put("/folders/:id", authWare([2, 3, 4]), controller.update);
router.delete("/folders/:id", authWare([2, 3, 4]), controller.delete);

module.exports = router;
