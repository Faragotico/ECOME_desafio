const { Router } = require("express");
const ctrl = require("../controllers/comment.controller");

const router = Router();

router.get("/:id", ctrl.getById);
router.patch("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
