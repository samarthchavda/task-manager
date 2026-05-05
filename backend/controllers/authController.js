const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const user = new User({ name, email, password, role });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('Signup error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error('Login error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
