import { Column } from '../models/column.model.js';

export const columnController = {
  async getColumnsByBoardId(req, res, next) {
    try {
      const columns = await Column.findByBoardId(req.params.boardId);
      res.json(columns);
    } catch (error) {
      next(error);
    }
  },

  async getColumnById(req, res, next) {
    try {
      const column = await Column.findById(req.params.id);
      if (!column) {
        return res.status(404).json({ message: 'Column not found' });
      }
      res.json(column);
    } catch (error) {
      next(error);
    }
  },

  async createColumn(req, res, next) {
    try {
      const { board_id, title, position } = req.body;
      if (!board_id || !title || position === undefined) {
        return res.status(400).json({ message: 'board_id, title, and position are required' });
      }

      const column = await Column.create({ board_id, title, position });
      res.status(201).json(column);
    } catch (error) {
      next(error);
    }
  },

  async updateColumn(req, res, next) {
    try {
      const { title, position } = req.body;
      if (!title || position === undefined) {
        return res.status(400).json({ message: 'title and position are required' });
      }

      const column = await Column.update(req.params.id, { title, position });
      if (!column) {
        return res.status(404).json({ message: 'Column not found' });
      }

      res.json(column);
    } catch (error) {
      next(error);
    }
  },

  async deleteColumn(req, res, next) {
    try {
      await Column.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
