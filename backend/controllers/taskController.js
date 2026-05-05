const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const isValidDate = (d) => d && !Number.isNaN(new Date(d).getTime());

exports.createTask = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can create tasks' });
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;
    if (!title || !projectId) return res.status(400).json({ message: 'Title and projectId are required' });
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) return res.status(404).json({ message: 'Assigned user not found' });
    }
    if (dueDate && !isValidDate(dueDate)) return res.status(400).json({ message: 'Invalid due date' });
    const task = new Task({ title, description, projectId, assignedTo, priority, dueDate, createdBy: req.user._id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, priority, projectId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (projectId) filter.projectId = projectId;
    if (req.user.role === 'Member') {
      filter.assignedTo = req.user._id;
    }
    const tasks = await Task.find(filter).populate('projectId', 'title').populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId', 'title').populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role === 'Member' && (!task.assignedTo || !task.assignedTo._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(task);
  } catch (err) {
    console.error('Get task by id error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can update tasks' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;
    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      task.projectId = projectId;
    }
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) return res.status(404).json({ message: 'Assigned user not found' });
      task.assignedTo = assignedTo;
    }
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) {
      if (!isValidDate(dueDate)) return res.status(400).json({ message: 'Invalid due date' });
      task.dueDate = dueDate;
    }
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Update task error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can delete tasks' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.remove();
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error('Delete task error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status required' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Member can update only their assigned tasks
    if (req.user.role === 'Member') {
      if (!task.assignedTo || !task.assignedTo.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
      task.status = status;
      await task.save();
      return res.json(task);
    }
    // Admin can update any
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Update task status error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
