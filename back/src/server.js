import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/database.js';
import { initDatabase } from './config/init-db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to Azure SQL Database
    await connectDB();
    
    // Initialize database tables
    await initDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
