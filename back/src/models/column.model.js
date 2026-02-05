import { getPool, isMockMode } from '../config/database.js';
import { mockData } from '../data/mockData.js';
import sql from 'mssql';

export const Column = {
  async findByBoardId(boardId) {
    if (isMockMode()) {
      return mockData.columns.getByBoardId(boardId);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('boardId', sql.Int, boardId)
      .query('SELECT * FROM Columns WHERE board_id = @boardId ORDER BY position');
    return result.recordset;
  },

  async findById(id) {
    if (isMockMode()) {
      return mockData.columns.getById(id);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Columns WHERE id = @id');
    return result.recordset[0];
  },

  async create(data) {
    if (isMockMode()) {
      return mockData.columns.create(data);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('boardId', sql.Int, data.board_id)
      .input('title', sql.NVarChar, data.title)
      .input('position', sql.Int, data.position)
      .query(`
        INSERT INTO Columns (board_id, title, position)
        OUTPUT INSERTED.*
        VALUES (@boardId, @title, @position)
      `);
    return result.recordset[0];
  },

  async update(id, data) {
    if (isMockMode()) {
      return mockData.columns.update(id, data);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, data.title)
      .input('position', sql.Int, data.position)
      .query(`
        UPDATE Columns
        SET title = @title,
            position = @position,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0];
  },

  async delete(id) {
    if (isMockMode()) {
      return mockData.columns.delete(id);
    }
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Columns WHERE id = @id');
  }
};
