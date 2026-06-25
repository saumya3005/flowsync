const Comment = require('../models/Comment');
const Task = require('../models/Task');

// @desc    Add a comment to a task
// @route   POST /api/comments/:taskId
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { taskId } = req.params;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Please provide comment text' });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const comment = await Comment.create({
      task: taskId,
      user: req.user._id,
      text,
    });

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name avatar');

    res.status(201).json({ success: true, message: 'Comment added successfully', data: populatedComment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a task
// @route   GET /api/comments/:taskId
// @access  Private
const getCommentsByTask = async (req, res, next) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, message: 'Comments fetched successfully', data: comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: comment._id });

    res.status(200).json({ success: true, message: 'Comment removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getCommentsByTask,
  deleteComment,
};
