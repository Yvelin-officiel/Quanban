import sql from 'mssql';
import dotenv from 'dotenv';
import { getSecret } from './keyvault.js';

dotenv.config();

let pool = null;

/**
 * Build database configuration with password from Key Vault
 */
const buildConfig = async () => {
  let password = process.env.DB_PASSWORD;

  // Try to get password from Key Vault if configured
  if (process.env.KEY_VAULT_NAME && process.env.DB_PASSWORD_SECRET_NAME) {
    try {
      const secretPassword = await getSecret(process.env.DB_PASSWORD_SECRET_NAME);
      if (secretPassword) {
        password = secretPassword;
        console.log('Database password retrieved from Azure Key Vault');
      }
    } catch (error) {
      console.warn('Failed to retrieve password from Key Vault, falling back to environment variable');
    }
  }

  // Fallback to environment variable or throw error if not available
  if (!password) {
    throw new Error('DB_PASSWORD must be set in environment variables or available in Key Vault');
  }

  return {
    user: process.env.DB_USER || 'quanbanadmin',
    password: password,
    server: process.env.DB_SERVER || 'quanban-server-b3zx2ffjkgkwo.database.windows.net',
    database: process.env.DB_NAME || 'quanban-db',
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
};

let useMockData = false;

export const connectDB = async () => {
  try {
    if (!pool && !useMockData) {
      const config = await buildConfig();
      pool = await sql.connect(config);
      console.log('✅ Connected to Azure SQL Database');
      useMockData = false;
    }
    return pool;
  } catch (err) {
    console.warn('⚠️  Database connection failed, using MOCK DATA');
    console.error('Error details:', err.message);
    useMockData = true;
    pool = null;
  }
};

export const getPool = () => {
  if (!pool && !useMockData) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return pool;
};

export const isMockMode = () => useMockData;

export const closeDB = async () => {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection closed');
  }
};

export default { connectDB, getPool, closeDB, isMockMode };
