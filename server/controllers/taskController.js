const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate, labels } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: 'Please provide title and projectId' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: req.user._id,
      priority,
      dueDate,
      labels,
    });

    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    // Basic implementation: get tasks where user is assigned or created
    const tasks = await Task.find({
      $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }],
    }).populate('project', 'title').populate('assignedTo', 'name avatar');

    res.status(200).json({ success: true, message: 'Tasks fetched successfully', data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar')
      .populate('project', 'title owner members');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task fetched successfully', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks by project ID
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: 'Tasks fetched successfully', data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check auth
    const isOwner = task.project.owner.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();

    if (!isOwner && !isAssignee && !isCreator) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Task updated successfully', data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isOwner = task.project.owner.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();

    if (!isOwner && !isCreator) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.deleteOne({ _id: task._id });

    res.status(200).json({ success: true, message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide a valid status' });
    }

    task.status = status;
    const updatedTask = await task.save();

    res.status(200).json({ success: true, message: 'Task status updated', data: updatedTask });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  getTasksByProject,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
