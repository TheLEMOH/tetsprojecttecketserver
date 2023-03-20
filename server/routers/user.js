const Router = require("express");
const router = new Router();
const controller = require("../controllers/user");
const authWare = require("../middleware/roleMiddleware");

router.post("/users", authWare([4]), controller.create);
router.get("/users", authWare([1, 2, 3, 4]), controller.get);
router.get("/userspages", authWare([2, 3, 4]), controller.getPages);
router.get("/users/employees", authWare(), controller.getEmployees);
router.get("/users/:id", authWare([1, 2, 3, 4]), controller.getOne);
router.put("/users/:id", authWare([1, 2, 3, 4]), controller.update);
router.delete("/users/:id", authWare([4]), controller.delete);

module.exports = router;
