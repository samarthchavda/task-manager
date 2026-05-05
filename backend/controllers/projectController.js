const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can create projects' });
    const { title, description, members } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const project = new Project({ title, description, createdBy: req.user._id, members: members || [] });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      const projects = await Project.find().populate('createdBy', 'name email role').populate('members', 'name email role');
      return res.json(projects);
    }
    // Member: show projects where member or createdBy
    const projects = await Project.find({ $or: [{ members: req.user._id }, { createdBy: req.user._id }] })
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role');
    res.json(projects);
  } catch (err) {
    console.error('Get projects error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email role').populate('members', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (req.user.role !== 'Admin') {
      const isMember = project.members.some(m => m._id.equals(req.user._id));
      if (!isMember && !project.createdBy._id.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(project);
  } catch (err) {
    console.error('Get project by id error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can update projects' });
    const { title, description, members } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (Array.isArray(members)) project.members = members;
    await project.save();
    res.json(project);
  } catch (err) {
    console.error('Update project error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can delete projects' });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.remove();
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error('Delete project error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
