import express from 'express';
import cors from 'cors';
import boardRoutes from './routes/board.routes.js';
import columnRoutes from './routes/column.routes.js';
import taskRoutes from './routes/task.routes.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Kanban routes
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

export default app;
