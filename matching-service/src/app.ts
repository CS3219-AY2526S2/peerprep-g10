import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { queueService } from './services/queue.service';
import { matchingService } from './services/matching.service';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
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

// Test Queue Route
app.post('/test/findmatch', async (req: Request, res: Response) => {
  const userId = String(req.body.userid);
  const topic = req.body.topic;
  const difficulty = req.body.difficulty;
  const socketId = req.body.socketId;

  await queueService.addUserToQueue(userId, socketId, topic, difficulty);
  await matchingService.findMatch(socketId, userId, topic, difficulty);

  const message = `userId = ${userId}, topic = ${topic}, difficult = ${difficulty} added to queue`
  console.log(message);
  res.status(200).json({
    message: message,
    body: req.body
  });
});

// 404 fallback, catch any HTTP requests that don't match the defined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.path} does not exist on the Matching Service.`,
  });
});

export default app;