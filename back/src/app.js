import express from 'express';
import cors from 'cors';
import boardRoutes from './routes/board.routes.js';
import columnRoutes from './routes/column.routes.js';
import taskRoutes from './routes/task.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import { isMockMode } from './config/database.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mode: isMockMode() ? 'MOCK' : 'DATABASE',
    service: 'Quanban API',
    version: '1.0.0'
  });
});

// Kanban routes
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

export default app;
