import { Board } from '../models/board.model.js';
import { Column } from '../models/column.model.js';
import { Task } from '../models/task.model.js';

export const boardController = {
  async getAllBoards(req, res, next) {
    try {
      const boards = await Board.findAll();
      res.json(boards);
    } catch (error) {
      next(error);
    }
  },

  async getBoardById(req, res, next) {
    try {
      const board = await Board.findById(req.params.id);
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }
      res.json(board);
    } catch (error) {
      next(error);
    }
  },

  async getBoardWithDetails(req, res, next) {
    try {
      const board = await Board.findById(req.params.id);
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }

      const columns = await Column.findByBoardId(req.params.id);
      
      // Get tasks for each column
      const columnsWithTasks = await Promise.all(
        columns.map(async (column) => {
          const tasks = await Task.findByColumnId(column.id);
          return { ...column, tasks };
        })
      );

      res.json({ ...board, columns: columnsWithTasks });
    } catch (error) {
      next(error);
    }
  },

  async createBoard(req, res, next) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const board = await Board.create({ title, description });
      res.status(201).json(board);
    } catch (error) {
      next(error);
    }
  },

  async updateBoard(req, res, next) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const board = await Board.update(req.params.id, { title, description });
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }

      res.json(board);
    } catch (error) {
      next(error);
    }
  },

  async deleteBoard(req, res, next) {
    try {
      await Board.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
