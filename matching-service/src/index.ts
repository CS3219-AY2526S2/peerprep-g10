import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;
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

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Matching Service is running perfectly.' });
});

// Start the server
app.listen(port, () => {
  console.log(`[server]: Matching Service is running at http://localhost:${port}`);
});