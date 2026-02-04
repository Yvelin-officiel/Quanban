import express from 'express';
import { boardController } from '../controllers/board.controller.js';

const router = express.Router();

router.get('/', boardController.getAllBoards);
router.get('/:id', boardController.getBoardById);
router.get('/:id/details', boardController.getBoardWithDetails);
router.post('/', boardController.createBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

export default router;
