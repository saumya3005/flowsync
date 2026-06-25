const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  getTasksByProject,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createTask).get(protect, getTasks);
router.route('/project/:projectId').get(protect, getTasksByProject);
router.route('/:id').get(protect, getTaskById).put(protect, updateTask).delete(protect, deleteTask);
router.route('/:id/status').patch(protect, updateTaskStatus);

module.exports = router;
