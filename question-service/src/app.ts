import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import questionRoutes from './routes/questionRoutes';

const app: Express = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(helmet());

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Question Service is running perfectly.' });
});

app.use('/questions', questionRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.path} does not exist on the Question Service.`,
  });
});

export default app;
