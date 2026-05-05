const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createProject, getProjects } = require('../controllers/projectController');

router.use(authMiddleware);

router.post('/', createProject);
router.get('/', getProjects);

module.exports = router;
