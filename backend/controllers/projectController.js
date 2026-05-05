const Project = require('../models/Project');
const User = require('../models/User');
const mongoose = require('mongoose');

const isValidIdList = (ids) => Array.isArray(ids) && ids.every((id) => mongoose.Types.ObjectId.isValid(id));

exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can create projects' });
    const { title, description, members } = req.body;
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return res.status(400).json({ message: 'Title is required' });

    const memberIds = Array.isArray(members) ? [...new Set(members.filter(Boolean))] : [];
    if (!isValidIdList(memberIds)) {
      return res.status(400).json({ message: 'Invalid team member selection' });
    }

    const foundMembers = await User.find({ _id: { $in: memberIds } }).select('_id');
    if (foundMembers.length !== memberIds.length) {
      return res.status(400).json({ message: 'One or more team members do not exist' });
    }

    const projectMemberIds = [...new Set([req.user._id.toString(), ...memberIds.map(String)])];
    const project = new Project({
      title: trimmedTitle,
      description: description?.trim() || '',
      createdBy: req.user._id,
      members: projectMemberIds,
    });
    await project.save();
    // Populate before sending response so frontend gets full user data
    await project.populate('members', 'name email role');
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
