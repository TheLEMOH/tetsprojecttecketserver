const Router = require("express");
const router = new Router();
const controller = require("../controllers/step");

router.get("/steps", controller.getByFilter);

module.exports = router;
