import { AttemptModel, QuestionSnapshot } from '../../attempts/attemptModel';
import { pool } from '../../db';

// Mock the db pool
jest.mock('../../db', () => ({
  pool: { query: jest.fn() },
}));

const mockQuery = pool.query as jest.Mock;

const mockSnapshot: QuestionSnapshot = {
  id: '1',
  title: 'Two Sum',
  description: 'Given an array...',
  topics: ['Arrays', 'Hash Tables'],
  difficulty: 'easy',
  examples: 'Example 1:\nInput: nums = [2,7,11,15]',
  pseudocode: 'function twoSum(nums, target) {...}',
};

const mockRow = {
  id: 'attempt-uuid',
  roomId: 'room-uuid',
  userId: '1',
  partnerId: '2',
  questionId: '1',
  questionSnapshot: mockSnapshot,
  code: 'print("hello")',
  startedAt: new Date('2024-01-01T10:00:00Z'),
  endedAt: new Date('2024-01-01T10:30:00Z'),
  createdAt: new Date('2024-01-01T10:30:00Z'),
};

describe('AttemptModel', () => {
  describe('createAttempt', () => {
    it('inserts and returns the new attempt', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockRow] });

      const result = await AttemptModel.createAttempt({
        roomId: 'room-uuid',
        userId: '1',
        partnerId: '2',
        questionId: '1',
        questionSnapshot: mockSnapshot,
        code: 'print("hello")',
        startedAt: new Date('2024-01-01T10:00:00Z'),
        endedAt: new Date('2024-01-01T10:30:00Z'),
      });

      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRow);
    });
  });

  describe('getAttemptsByUser', () => {
    it('returns rows ordered by createdAt desc', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockRow] });

      const result = await AttemptModel.getAttemptsByUser('1');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = $1'), ['1']);
      expect(result).toEqual([mockRow]);
    });

    it('returns empty array when user has no attempts', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await AttemptModel.getAttemptsByUser('unknown-user');

      expect(result).toEqual([]);
    });
  });

  describe('getAttemptById', () => {
    it('returns the attempt when found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockRow] });

      const result = await AttemptModel.getAttemptById('attempt-uuid');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), ['attempt-uuid']);
      expect(result).toEqual(mockRow);
    });

    it('returns null when not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await AttemptModel.getAttemptById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('getAttemptedQuestionIdsByUser', () => {
    it('returns flat array of questionIds', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ questionId: '1' }, { questionId: '5' }, { questionId: '12' }],
      });

      const result = await AttemptModel.getAttemptedQuestionIdsByUser('1');

      expect(result).toEqual(['1', '5', '12']);
    });

    it('returns empty array when user has no attempts', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await AttemptModel.getAttemptedQuestionIdsByUser('1');

      expect(result).toEqual([]);
    });

    it('uses DISTINCT in the query', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      await AttemptModel.getAttemptedQuestionIdsByUser('1');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('DISTINCT'),
        ['1']
      );
    });
  });
});
