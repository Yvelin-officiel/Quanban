import { getPool } from '../config/database.js';
import sql from 'mssql';

export const Board = {
  async findAll() {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM Boards ORDER BY created_at DESC');
    return result.recordset;
  },

  async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Boards WHERE id = @id');
    return result.recordset[0];
  },

  async create(data) {
    const pool = getPool();
    const result = await pool.request()
      .input('title', sql.NVarChar, data.title)
      .input('description', sql.NVarChar, data.description)
      .query(`
        INSERT INTO Boards (title, description)
        OUTPUT INSERTED.*
        VALUES (@title, @description)
      `);
    return result.recordset[0];
  },

  async update(id, data) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('title', sql.NVarChar, data.title)
      .input('description', sql.NVarChar, data.description)
      .query(`
        UPDATE Boards
        SET title = @title,
            description = @description,
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
      .query('DELETE FROM Boards WHERE id = @id');
  }
};
