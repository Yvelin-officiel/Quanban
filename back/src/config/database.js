import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

export const connectDB = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('Connected to Azure SQL Database');
    }
    return pool;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return pool;
};

export const closeDB = async () => {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection closed');
  }
};

export default { connectDB, getPool, closeDB };
