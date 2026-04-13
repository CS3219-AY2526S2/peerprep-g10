import { AttemptService } from '../../attempts/attemptService';
import { AttemptModel } from '../../attempts/attemptModel';

// Mock the model
jest.mock('../../attempts/attemptModel', () => ({
  AttemptModel: {
    createAttempt: jest.fn(),
    getAttemptsByUser: jest.fn(),
    getAttemptById: jest.fn(),
    getAttemptedQuestionIdsByUser: jest.fn(),
  },
}));

const mockModel = AttemptModel as jest.Mocked<typeof AttemptModel>;

// Mock global fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.Mock;

const mockSnapshot = {
  id: '1',
  title: 'Two Sum',
  description: 'Given an array...',
  topics: ['Arrays', 'Hash Tables'],
  difficulty: 'easy',
  examples: 'Example 1:\nInput: nums = [2,7,11,15]',
  pseudocode: 'function twoSum(nums, target) {...}',
};

const mockAttemptRow = {
  id: 'attempt-uuid',
  roomId: 'room-uuid',
  userId: '1',
  partnerId: '2',
  questionId: '1',
  questionSnapshot: mockSnapshot,
  code: 'print("hello")',
  startedAt: '2024-01-01T10:00:00Z',
  endedAt: '2024-01-01T10:30:00Z',
  createdAt: '2024-01-01T10:30:00Z',
};

const mockPartner = { id: '2', username: 'John Doe', profile_icon: 'icon.png' };

describe('AttemptService', () => {
  describe('saveAttempt', () => {
    it('fetches question snapshot and saves attempt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, title: 'Two Sum', topics: ['Arrays'], difficulty: 'easy', description: 'desc', examples: 'ex', pseudocode: 'ps' }),
      });
      mockModel.createAttempt.mockResolvedValueOnce(mockAttemptRow);

      const result = await AttemptService.saveAttempt({
        roomId: 'room-uuid',
        userId: '1',
        partnerId: '2',
        questionId: '1',
        code: 'print("hello")',
        startedAt: new Date('2024-01-01T10:00:00Z'),
        endedAt: new Date('2024-01-01T10:30:00Z'),
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockModel.createAttempt).toHaveBeenCalledWith(
        expect.objectContaining({ questionSnapshot: expect.objectContaining({ id: '1' }) })
      );
      expect(result).toEqual(mockAttemptRow);
    });
  });

  describe('getAttemptsByUser', () => {
    it('returns attempts with question from snapshot and partner from user service', async () => {
      mockModel.getAttemptsByUser.mockResolvedValueOnce([mockAttemptRow]);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPartner],
      });

      const result = await AttemptService.getAttemptsByUser('1');

      expect(result[0].question).toEqual(mockSnapshot);
      expect(result[0].partner).toEqual(mockPartner);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('batch fetches partners in a single call regardless of attempt count', async () => {
      const rows = [
        { ...mockAttemptRow, id: 'a1', partnerId: '2' },
        { ...mockAttemptRow, id: 'a2', partnerId: '3' },
        { ...mockAttemptRow, id: 'a3', partnerId: '2' }, // duplicate partner
      ];
      mockModel.getAttemptsByUser.mockResolvedValueOnce(rows);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPartner, { id: '3', username: 'Jane', profile_icon: '' }],
      });

      await AttemptService.getAttemptsByUser('1');

      // Only 1 fetch call for all partners (deduped)
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.ids).toHaveLength(2); // 2 and 3, not 3
    });

    it('sets partner to null when user service fails', async () => {
      mockModel.getAttemptsByUser.mockResolvedValueOnce([mockAttemptRow]);
      mockFetch.mockResolvedValueOnce({ ok: false });

      const result = await AttemptService.getAttemptsByUser('1');

      expect(result[0].partner).toBeNull();
    });

    it('returns empty array when user has no attempts', async () => {
      mockModel.getAttemptsByUser.mockResolvedValueOnce([]);

      const result = await AttemptService.getAttemptsByUser('1');

      expect(result).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('getAttemptById', () => {
    it('returns attempt with snapshot and partner', async () => {
      mockModel.getAttemptById.mockResolvedValueOnce(mockAttemptRow);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPartner],
      });

      const result = await AttemptService.getAttemptById('attempt-uuid');

      expect(result?.question).toEqual(mockSnapshot);
      expect(result?.partner).toEqual(mockPartner);
    });

    it('returns null when attempt not found', async () => {
      mockModel.getAttemptById.mockResolvedValueOnce(null);

      const result = await AttemptService.getAttemptById('nonexistent');

      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('does not call user service when partnerId is null', async () => {
      mockModel.getAttemptById.mockResolvedValueOnce({ ...mockAttemptRow, partnerId: null });

      const result = await AttemptService.getAttemptById('attempt-uuid');

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result?.partner).toBeNull();
    });
  });

  describe('getAttemptedQuestionIdsByUser', () => {
    it('delegates directly to model', async () => {
      mockModel.getAttemptedQuestionIdsByUser.mockResolvedValueOnce(['1', '5', '12']);

      const result = await AttemptService.getAttemptedQuestionIdsByUser('1');

      expect(mockModel.getAttemptedQuestionIdsByUser).toHaveBeenCalledWith('1');
      expect(result).toEqual(['1', '5', '12']);
    });
  });
});
