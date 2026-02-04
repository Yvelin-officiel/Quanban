import express from 'express';
import cors from 'cors';
import fooRoutes from './routes/foo.routes.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/foo', fooRoutes);

app.use(errorHandler);

export default app;
