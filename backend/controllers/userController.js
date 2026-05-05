const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Only admins can view users' });
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Get users error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
