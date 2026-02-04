import express from 'express';
import { columnController } from '../controllers/column.controller.js';

const router = express.Router();

router.get('/board/:boardId', columnController.getColumnsByBoardId);
router.get('/:id', columnController.getColumnById);
router.post('/', columnController.createColumn);
router.put('/:id', columnController.updateColumn);
router.delete('/:id', columnController.deleteColumn);

export default router;
