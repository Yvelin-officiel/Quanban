import { getPool } from './database.js';

export const initDatabase = async () => {
  try {
    const pool = getPool();

    // Create Users table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      CREATE TABLE Users (
        id INT PRIMARY KEY IDENTITY(1,1),
        username NVARCHAR(255) NOT NULL UNIQUE,
        email NVARCHAR(255) NOT NULL UNIQUE,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
      )
    `);

    // Create Boards table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Boards' AND xtype='U')
      CREATE TABLE Boards (
        id INT PRIMARY KEY IDENTITY(1,1),
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
      )
    `);

    // Create Columns table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Columns' AND xtype='U')
      CREATE TABLE Columns (
        id INT PRIMARY KEY IDENTITY(1,1),
        board_id INT NOT NULL,
        title NVARCHAR(255) NOT NULL,
        position INT NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (board_id) REFERENCES Boards(id) ON DELETE CASCADE
      )
    `);

    // Create Tasks table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tasks' AND xtype='U')
      CREATE TABLE Tasks (
        id INT PRIMARY KEY IDENTITY(1,1),
        column_id INT NOT NULL,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        position INT NOT NULL,
        priority NVARCHAR(20) DEFAULT 'medium',
        due_date DATETIME2,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (column_id) REFERENCES Columns(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};
