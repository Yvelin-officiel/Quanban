import express from 'express';
import { taskController } from '../controllers/task.controller.js';

const router = express.Router();

router.get('/column/:columnId', taskController.getTasksByColumnId);
router.get('/board/:boardId', taskController.getTasksByBoardId);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
