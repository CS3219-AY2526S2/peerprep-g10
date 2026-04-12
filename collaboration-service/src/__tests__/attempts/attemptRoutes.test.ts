import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import attemptRoutes from '../../attempts/attemptRoutes';
import { AttemptService } from '../../attempts/attemptService';

// Mock the Redis ban lookup used by auth middleware
jest.mock('../../config/authRedis', () => ({
  banCheckClient: {
    sIsMember: jest.fn().mockResolvedValue(false),
  },
}));

// Mock the service
jest.mock('../../attempts/attemptService', () => ({
  AttemptService: {
    saveAttempt: jest.fn(),
    getAttemptsByUser: jest.fn(),
    getAttemptById: jest.fn(),
    getAttemptedQuestionIdsByUser: jest.fn(),
  },
}));

process.env.JWT_SECRET = 'test-secret';
process.env.SERVICE_SECRET_KEY = 'service-secret';

const createAuthToken = (payload = { userId: 1, access_role: 'user' }) =>
  jwt.sign(payload, process.env.JWT_SECRET as string);

const authHeader = `Bearer ${createAuthToken()}`;
const serviceAuthHeader = `Bearer ${process.env.SERVICE_SECRET_KEY}`;

const mockService = AttemptService as jest.Mocked<typeof AttemptService>;

// Minimal express app for testing
const app = express();
app.use(express.json());
app.use('/attempts', attemptRoutes);

const mockAttempt = {
  id: 'attempt-uuid',
  roomId: 'room-uuid',
  userId: '1',
  partnerId: '2',
  questionId: '1',
  questionSnapshot: { id: '1', title: 'Two Sum', description: '', topics: [], difficulty: 'easy', examples: '', pseudocode: '' },
  partner: { id: '2', username: 'John Doe', profile_icon: '' },
  code: 'print("hello")',
  startedAt: '2024-01-01T10:00:00Z',
  endedAt: '2024-01-01T10:30:00Z',
  createdAt: '2024-01-01T10:30:00Z',
};

describe('POST /attempts', () => {
  it('returns 201 with attempt on success', async () => {
    mockService.saveAttempt.mockResolvedValueOnce(mockAttempt);

    const res = await request(app).post('/attempts').send({
      roomId: 'room-uuid',
      userId: '1',
      partnerId: '2',
      questionId: '1',
      code: 'print("hello")',
      startedAt: '2024-01-01T10:00:00Z',
      endedAt: '2024-01-01T10:30:00Z',
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockAttempt);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/attempts').send({
      userId: '1',
      // missing roomId, questionId, startedAt, endedAt
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  it('defaults code to empty string when not provided', async () => {
    mockService.saveAttempt.mockResolvedValueOnce(mockAttempt);

    await request(app).post('/attempts').send({
      roomId: 'room-uuid',
      userId: '1',
      questionId: '1',
      startedAt: '2024-01-01T10:00:00Z',
      endedAt: '2024-01-01T10:30:00Z',
    });

    expect(mockService.saveAttempt).toHaveBeenCalledWith(
      expect.objectContaining({ code: '' })
    );
  });

  it('returns 500 when service throws', async () => {
    mockService.saveAttempt.mockRejectedValueOnce(new Error('DB error'));

    const res = await request(app).post('/attempts').send({
      roomId: 'room-uuid',
      userId: '1',
      questionId: '1',
      startedAt: '2024-01-01T10:00:00Z',
      endedAt: '2024-01-01T10:30:00Z',
    });

    expect(res.status).toBe(500);
  });
});

describe('GET /attempts/user/:userId', () => {
  it('returns list of attempts', async () => {
    mockService.getAttemptsByUser.mockResolvedValueOnce([mockAttempt]);

    const res = await request(app)
      .get('/attempts/user/1')
      .set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockAttempt]);
    expect(mockService.getAttemptsByUser).toHaveBeenCalledWith('1');
  });

  it('returns empty array when user has no attempts', async () => {
    mockService.getAttemptsByUser.mockResolvedValueOnce([]);

    const res = await request(app)
      .get('/attempts/user/1')
      .set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 500 when service throws', async () => {
    mockService.getAttemptsByUser.mockRejectedValueOnce(new Error('DB error'));

    const res = await request(app)
      .get('/attempts/user/1')
      .set('Authorization', authHeader);

    expect(res.status).toBe(500);
  });
});

describe('GET /attempts/user/:userId/questions', () => {
  it('returns userId and questionIds array', async () => {
    mockService.getAttemptedQuestionIdsByUser.mockResolvedValueOnce(['1', '5', '12']);

    const res = await request(app)
      .get('/attempts/user/1/questions')
      .set('Authorization', serviceAuthHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: '1', questionIds: ['1', '5', '12'] });
  });

  it('returns empty questionIds array when user has no attempts', async () => {
    mockService.getAttemptedQuestionIdsByUser.mockResolvedValueOnce([]);

    const res = await request(app)
      .get('/attempts/user/1/questions')
      .set('Authorization', serviceAuthHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: '1', questionIds: [] });
  });

  it('returns 500 when service throws', async () => {
    mockService.getAttemptedQuestionIdsByUser.mockRejectedValueOnce(new Error('DB error'));

    const res = await request(app)
      .get('/attempts/user/1/questions')
      .set('Authorization', serviceAuthHeader);

    expect(res.status).toBe(500);
  });
});

describe('GET /attempts/:id', () => {
  it('returns attempt when found', async () => {
    mockService.getAttemptById.mockResolvedValueOnce(mockAttempt);

    const res = await request(app)
      .get('/attempts/attempt-uuid')
      .set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAttempt);
  });

  it('returns 404 when attempt not found', async () => {
    mockService.getAttemptById.mockResolvedValueOnce(null);

    const res = await request(app)
      .get('/attempts/nonexistent-id')
      .set('Authorization', authHeader);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Attempt not found');
  });

  it('returns 500 when service throws', async () => {
    mockService.getAttemptById.mockRejectedValueOnce(new Error('DB error'));

    const res = await request(app)
      .get('/attempts/attempt-uuid')
      .set('Authorization', authHeader);

    expect(res.status).toBe(500);
  });
});
