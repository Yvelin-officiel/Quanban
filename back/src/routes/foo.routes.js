import express from 'express';
import {
  getAllFoos,
  getFooById,
  createFoo,
  updateFoo,
  deleteFoo
} from '../controllers/foo.controller.js';

const router = express.Router();

router.get('/', getAllFoos);
router.get('/:id', getFooById);
router.post('/', createFoo);
router.put('/:id', updateFoo);
router.delete('/:id', deleteFoo);

export default router;
