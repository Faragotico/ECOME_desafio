const { Router } = require("express");
const ctrl = require("../controllers/post.controller");
const commentCtrl = require("../controllers/comment.controller");

const router = Router();

router.post("/", ctrl.create);
router.get("/", ctrl.listAll);
router.get("/:id", ctrl.getById);
router.patch("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// Comentários aninhados em posts
router.post("/:id/comments", commentCtrl.create);

module.exports = router;
