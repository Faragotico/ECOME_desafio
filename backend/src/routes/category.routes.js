const { Router } = require("express");
const ctrl = require("../controllers/category.controller");

const router = Router();

router.post("/", ctrl.create);
router.get("/", ctrl.listAll);
router.get("/:id", ctrl.getById);
router.patch("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
