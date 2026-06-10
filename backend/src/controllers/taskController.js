import Task from "../models/Task.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create task
// @route   POST /api/v1/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, completed } = req.body;

  const task = await Task.create({
    title,
    description,
    completed,
    createdBy: req.user._id, 
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

// @desc    Get all tasks
// @route   GET /api/v1/tasks
// @access  Private
// Admin gets all tasks, user gets only their own
export const getTasks = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  // Base filter — admin sees all, user sees own
  const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };

  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.max(1, Number(limit));

  const skip = (pageNumber - 1) * limitNumber;

  const query = Task.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limitNumber));

  if (req.user.role === "admin") {
    query.populate("createdBy", "name email");
  }

  const tasks = await query;
  const total = await Task.countDocuments(filter);

  res.status(200).json({
    success: true,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    tasks,
  });
});

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "createdBy",
    "name email",
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  if (
    task.createdBy._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view this task",
    });
  }

  res.status(200).json({
    success: true,
    task,
  });
});

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  if (
    task.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this task",
    });
  }

  const { title, description, completed } = req.body;

  task = await Task.findByIdAndUpdate(
    req.params.id,
    { title, description, completed },
    {
      new: true, 
      runValidators: true, 
    },
  );

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task,
  });
});

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private — admin/owner only
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  if (
    task.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this task",
    });
  }

  await task.deleteOne(); 

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});