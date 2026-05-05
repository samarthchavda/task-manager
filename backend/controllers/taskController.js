const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const mongoose = require('mongoose');

const isValidDate = (d) => d && !Number.isNaN(new Date(d).getTime());
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createTask = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can create tasks' });
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;
    const trimmedTitle = title?.trim();
    if (!trimmedTitle || !projectId) return res.status(400).json({ message: 'Title and projectId are required' });
    if (!isValidObjectId(projectId)) return res.status(400).json({ message: 'Invalid project id' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (assignedTo) {
      if (!isValidObjectId(assignedTo)) return res.status(400).json({ message: 'Invalid assigned user id' });
      const user = await User.findById(assignedTo);
      if (!user) return res.status(404).json({ message: 'Assigned user not found' });
      const isProjectMember = project.members.some((memberId) => memberId.equals(user._id));
      if (!isProjectMember) return res.status(400).json({ message: 'Assigned user must be part of the project team' });
    }
    if (dueDate && !isValidDate(dueDate)) return res.status(400).json({ message: 'Invalid due date' });

    const task = new Task({
      title: trimmedTitle,
      description: description?.trim() || '',
      projectId,
      assignedTo: assignedTo || undefined,
      priority: ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium',
      dueDate: dueDate || undefined,
      createdBy: req.user._id,
    });

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
    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) filter.status = status;
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) filter.priority = priority;
    if (projectId && isValidObjectId(projectId)) filter.projectId = projectId;
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

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

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
