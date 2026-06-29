const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  getTasksByProject,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addChecklistItem,
  updateChecklistItem,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

// IMPORTANT: specific routes before param routes to avoid /:id swallowing them
router.get("/project/:projectId", protect, getTasksByProject);

router.route("/")
  .post(protect, createTask)
  .get(protect, getTasks);

router.route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch("/:id/status", protect, updateTaskStatus);

router.post("/:id/checklist", protect, addChecklistItem);

router.patch("/:id/checklist/:itemId", protect, updateChecklistItem);

module.exports = router;