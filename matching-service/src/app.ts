import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Set HTTP headers to secure app
app.use(helmet());

// Configure CORS to allow only PeerPrep frontend to communicate with this service
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Parse incoming JSON payloads
app.use(express.json());

// Home Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'Welcome to PeerPrep Matching Service. Use /health to check server status',
    available_endpoints: [
      '/health',
    ] 
  });
});

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Matching Service is running perfectly.' });
});

// 404 fallback, catch any HTTP requests that don't match the defined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.path} does not exist on the Matching Service.`,
  });
});

export default app;
