import { Task } from '../models/task.model.js';

export const taskController = {
  async getTasksByColumnId(req, res, next) {
    try {
      const tasks = await Task.findByColumnId(req.params.columnId);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  },

  async getTasksByBoardId(req, res, next) {
    try {
      const tasks = await Task.findByBoardId(req.params.boardId);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  async createTask(req, res, next) {
    try {
      const { column_id, title, description, position, priority, due_date } = req.body;
      if (!column_id || !title || position === undefined) {
        return res.status(400).json({ message: 'column_id, title, and position are required' });
      }

      const task = await Task.create({
        column_id,
        title,
        description,
        position,
        priority,
        due_date
      });
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req, res, next) {
    try {
      const { column_id, title, description, position, priority, due_date } = req.body;
      if (!column_id || !title || position === undefined) {
        return res.status(400).json({ message: 'column_id, title, and position are required' });
      }

      const task = await Task.update(req.params.id, {
        column_id,
        title,
        description,
        position,
        priority,
        due_date
      });

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req, res, next) {
    try {
      await Task.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
