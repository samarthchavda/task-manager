const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createTask, getTasks, getTaskById, updateTask, deleteTask, updateTaskStatus } = require('../controllers/taskController');

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
