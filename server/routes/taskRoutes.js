const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTaskStatus,
  getDashboard
} = require("../controllers/taskController");

const {
  authMiddleware,
  authorizeRoles
} = require("../middleware/authMiddleware");

router.post("/", authMiddleware, authorizeRoles("admin"), createTask);

router.get("/", authMiddleware, getTasks);

router.put("/:id", authMiddleware, updateTaskStatus);

router.get("/dashboard", authMiddleware, getDashboard);

module.exports = router;