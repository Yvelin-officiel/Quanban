import dotenv from 'dotenv';
import app from './app.js';
import { connectDB, isMockMode } from './config/database.js';
import { initDatabase } from './config/init-db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to Azure SQL Database (or fallback to mock)
    await connectDB();
    
    // Initialize database tables (only if not in mock mode)
    if (!isMockMode()) {
      await initDatabase();
    } else {
      console.log('📝 Using MOCK data - skipping database initialization');
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      if (isMockMode()) {
        console.log('⚡ Mode: MOCK DATA (no database)');
      } else {
        console.log('💾 Mode: Azure SQL Database');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
