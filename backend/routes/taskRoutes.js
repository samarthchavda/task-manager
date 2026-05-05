const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
