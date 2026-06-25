const express = require('express');
const router = express.Router();
const { addComment, getCommentsByTask, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:taskId').post(protect, addComment).get(protect, getCommentsByTask);
router.route('/:id').delete(protect, deleteComment);

module.exports = router;
