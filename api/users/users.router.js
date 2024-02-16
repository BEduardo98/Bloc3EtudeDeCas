const express = require("express");
const usersController = require("./users.controller");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth");

router.get("/", authMiddleware, usersController.getAll);
router.get("/:id", authMiddleware, usersController.getById);
router.post("/", usersController.create);
router.put("/:id", authMiddleware, usersController.update);
router.delete("/:id", authMiddleware, usersController.delete);

module.exports = router;
