const Router = require("express");
const router = new Router();
const controller = require("../controllers/login");

router.get("/login", controller.login);
router.get("/refresh", controller.refresh);

module.exports = router;
