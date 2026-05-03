const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  addMember,
  deleteProject
} = require("../controllers/projectController");

const {
  authMiddleware,
  authorizeRoles
} = require("../middleware/authMiddleware");

router.post("/", authMiddleware, authorizeRoles("admin"), createProject);

router.get("/", authMiddleware, getProjects);

router.post("/add-member", authMiddleware, authorizeRoles("admin"), addMember);

router.delete("/:projectId", authMiddleware, authorizeRoles("admin"), deleteProject);

module.exports = router;