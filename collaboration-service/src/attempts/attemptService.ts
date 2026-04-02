import { AttemptModel } from './attemptModel';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3004';
const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://localhost:3003';

interface Partner {
  id: string;
  username: string;
  profile_icon: string;
}

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

async function fetchPartnersBatch(ids: string[]): Promise<Partner[]> {
  if (!ids.length) return [];

  try {
    const res = await fetch(`${USER_SERVICE_URL}/api/users/services/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SERVICE_SECRET_KEY}`,
      },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) throw new Error('Failed to fetch partners');

    const data = await res.json();
    const users: Partner[] = Array.isArray(data) ? data : [data];
    return users;
  } catch (err: any) {
    console.log("fetchPartnersBatch error:", { ids, message: err.message });
    return [];
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

    // Fetch partners in batch
    const partnerIds = Array.from(new Set(rows.map(r => r.partnerId)));
    const partners = await fetchPartnersBatch(partnerIds);
    const partnerMap = new Map(partners.map(p => [String(p.id), p]));

    const attemptsWithData = await Promise.all(
      rows.map(async (row) => {
        const question = await fetchQuestion(row.questionId);
        const partner = partnerMap.get(String(row.partnerId));
        return { ...row, question, partner };
      })
    );

    return attemptsWithData;
  },

  async getAttemptById(id: string) {
    const row = await AttemptModel.getAttemptById(id);
    if (!row) return null;

    const [question, partners] = await Promise.all([
      fetchQuestion(row.questionId),
      fetchPartnersBatch([row.partnerId]),
    ]);

    const partner = partners[0];
    return { ...row, question, partner };
  },
};