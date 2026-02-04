import { getPool } from '../config/database.js';
import sql from 'mssql';

export const Column = {
  async findByBoardId(boardId) {
    const pool = getPool();
    const result = await pool.request()
      .input('boardId', sql.Int, boardId)
      .query('SELECT * FROM Columns WHERE board_id = @boardId ORDER BY position');
    return result.recordset;
  },

  async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Columns WHERE id = @id');
    return result.recordset[0];
  },

  async create(data) {
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
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Columns WHERE id = @id');
  }
};
