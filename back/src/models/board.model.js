import { getPool, isMockMode } from '../config/database.js';
import { mockData } from '../data/mockData.js';
import sql from 'mssql';

export const Board = {
  async findAll() {
    if (isMockMode()) {
      return mockData.boards.getAll();
    }
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM Boards ORDER BY created_at DESC');
    return result.recordset;
  },

  async findById(id) {
    if (isMockMode()) {
      return mockData.boards.getById(id);
    }
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Boards WHERE id = @id');
    return result.recordset[0];
  },

  async create(data) {
    if (isMockMode()) {
      return mockData.boards.create(data);
    }
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
    if (isMockMode()) {
      return mockData.boards.update(id, data);
    }
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
    if (isMockMode()) {
      return mockData.boards.delete(id);
    }
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Boards WHERE id = @id');
  }
};
