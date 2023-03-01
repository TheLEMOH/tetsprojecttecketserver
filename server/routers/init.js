const Router = require("express");
const router = new Router();
const controllerOrg = require("../controllers/organization");
const controllerSystem = require("../controllers/system");
const controllerRoles = require("../controllers/role");
const controllersUsers = require("../controllers/user");
const controllersStatuses = require("../controllers/status");

router.get("/init/system", controllerSystem.getOne);
router.put("/init/system/:id", controllerSystem.update);

router.get("/init/organizations", controllerOrg.get);
router.post("/init/organizations", controllerOrg.create);

router.get("/init/roles", controllerRoles.get);

router.get("/init/users", controllersUsers.get);
router.post("/init/users", controllersUsers.create);

router.get("/init/statuses", controllersStatuses.get);

module.exports = router;
