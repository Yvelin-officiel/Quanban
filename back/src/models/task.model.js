import { getPool, isMockMode } from '../config/database.js';
import { mockData } from '../data/mockData.js';
import sql from 'mssql';

export const Task = {
  async findByColumnId(columnId) {
    if (isMockMode()) {
      return mockData.tasks.getByColumnId(columnId);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('columnId', sql.Int, columnId)
      .query('SELECT * FROM Tasks WHERE column_id = @columnId ORDER BY position');
    return result.recordset;
  },

  async findByBoardId(boardId) {
    if (isMockMode()) {
      return mockData.tasks.getByBoardId(boardId);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('boardId', sql.Int, boardId)
      .query(`
        SELECT t.* FROM Tasks t
        INNER JOIN Columns c ON t.column_id = c.id
        WHERE c.board_id = @boardId
        ORDER BY c.position, t.position
      `);
    return result.recordset;
  },

  async findById(id) {
    if (isMockMode()) {
      return mockData.tasks.getById(id);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Tasks WHERE id = @id');
    return result.recordset[0];
  },

  async create(data) {
    if (isMockMode()) {
      return mockData.tasks.create(data);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('columnId', sql.Int, data.column_id)
      .input('title', sql.NVarChar, data.title)
      .input('description', sql.NVarChar, data.description)
      .input('position', sql.Int, data.position)
      .input('priority', sql.NVarChar, data.priority || 'medium')
      .input('dueDate', sql.DateTime2, data.due_date || null)
      .query(`
        INSERT INTO Tasks (column_id, title, description, position, priority, due_date)
        OUTPUT INSERTED.*
        VALUES (@columnId, @title, @description, @position, @priority, @dueDate)
      `);
    return result.recordset[0];
  },

  async update(id, data) {
    if (isMockMode()) {
      return mockData.tasks.update(id, data);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('columnId', sql.Int, data.column_id)
      .input('title', sql.NVarChar, data.title)
      .input('description', sql.NVarChar, data.description)
      .input('position', sql.Int, data.position)
      .input('priority', sql.NVarChar, data.priority)
      .input('dueDate', sql.DateTime2, data.due_date || null)
      .query(`
        UPDATE Tasks
        SET column_id = @columnId,
            title = @title,
            description = @description,
            position = @position,
            priority = @priority,
            due_date = @dueDate,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0];
  },

  async delete(id) {
    if (isMockMode()) {
      return mockData.tasks.delete(id);
    }
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Tasks WHERE id = @id');
  }
};
