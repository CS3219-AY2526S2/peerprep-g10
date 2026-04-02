import { AttemptModel } from './attemptModel';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3004';
const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://localhost:3003';

async function fetchQuestion(questionId: string) {
  try {
    const res = await fetch(`${QUESTION_SERVICE_URL}/questions/${questionId}`);
    if (!res.ok) throw new Error('Failed to fetch partner');
    const q = await res.json();
    return {
      id: String(q.id),
      title: q.title,
      topics: q.topics ?? [],
      difficulty: q.difficulty ?? '',
      description: q.description ?? '',
      testCases: q.testCases ?? [],
    };
  } catch (err: any) {
    console.log("fetchQuestion error:", {
      questionId,
      message: err.message,
    });
    return null;
  }
}

async function fetchPartner(partnerId: string) {
  if (!partnerId) return null;

  try {
    const res = await fetch(`${USER_SERVICE_URL}/api/users/services/profile/${partnerId}`, {
      headers: { 
        Authorization: `Bearer ${process.env.SERVICE_SECRET_KEY}` },
    });

    if (!res.ok) throw new Error('Failed to fetch partner');
    const user = await res.json();

    return {
      id: String(user.id),
      username: user.username,
      profileIcon: user.profile_icon,
    };
  } catch (err: any) {
    console.log("fetchPartner error:", {
      partnerId,
      message: err.message,
    });
    return null;
  }
}

export const AttemptService = {
  async saveAttempt(data: {
    roomId: string;
    userId: string;
    partnerId: string;
    questionId: string;
    code: string;
    startedAt: Date;
    endedAt: Date;
  }) {
    return await AttemptModel.createAttempt(data);
  },

  async getAttemptsByUser(userId: string) {
    const rows = await AttemptModel.getAttemptsByUser(userId);

    return Promise.all(
      rows.map(async (row) => {
        const [question, partner] = await Promise.all([
          fetchQuestion(row.questionId),
          fetchPartner(row.partnerId),
        ]);
        return { ...row, question, partner };
      })
    );
  },

  async getAttemptById(id: string) {
    const row = await AttemptModel.getAttemptById(id);
    if (!row) return null;

    const [question, partner] = await Promise.all([
      fetchQuestion(row.questionId),
      fetchPartner(row.partnerId),
    ]);
    return { ...row, question, partner };
  },
};