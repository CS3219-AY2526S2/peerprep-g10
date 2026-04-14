import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import banRoutes from './routes/banRoutes';

const app: Express = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
// Configure CORS to allow only PeerPrep frontend to communicate with this service
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(helmet()); // Security headers
app.use(express.json()); // Parse incoming JSON payloads

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ban', banRoutes);

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'User Service is running perfectly.' });
});

export default app;