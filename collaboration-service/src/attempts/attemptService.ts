import { AttemptModel, QuestionSnapshot } from './attemptModel';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3004';
const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://localhost:3003';

interface Partner {
  id: string;
  username: string;
  profile_icon: string;
}

async function fetchQuestionSnapshot(questionId: string): Promise<QuestionSnapshot | null> {
  try {
    const res = await fetch(`${QUESTION_SERVICE_URL}/questions/${questionId}`);
    if (!res.ok) throw new Error('Failed to fetch question');
    const q = await res.json();

    return {
      id: String(q.id),
      title: q.title ?? '',
      topics: q.topics ?? [],
      difficulty: q.difficulty ?? '',
      description: q.description ?? '',
      examples: q.examples ?? '',
      pseudocode: q.pseudocode ?? '',
    };
  } catch (err: any) {
    console.warn('fetchQuestionSnapshot error:', { questionId, message: err.message });
    return null;
  }
}

// Batch fetch partner profiles by userId array
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
    const questionSnapshot = await fetchQuestionSnapshot(data.questionId);

    return await AttemptModel.createAttempt({ ...data, questionSnapshot });
  },

  async getAttemptsByUser(userId: string) {
    const rows = await AttemptModel.getAttemptsByUser(userId);

    // Fetch partners in batch
    const partnerIds = Array.from(new Set(rows.map(r => String(r.partnerId))));
    const partners = await fetchPartnersBatch(partnerIds);
    const partnerMap = new Map(partners.map(p => [String(p.id), p]));
  
    return rows.map((row) => ({
      ...row,
      question: row.questionSnapshot ?? null,
      partner: partnerMap.get(String(row.partnerId)) ?? null,
    }));
  },

  async getAttemptById(id: string) {
    const row = await AttemptModel.getAttemptById(id);
    if (!row) return null;

    const partners = row.partnerId ? await fetchPartnersBatch([row.partnerId]) : [];

    return {
      ...row,
      question: row.questionSnapshot ?? null,
      partner: partners[0] ?? null,
    };
  },

  /**
   * Returns the distinct list of questionIds the user has attempted.
   */
  async getAttemptedQuestionIdsByUser(userId: string): Promise<string[]> {
    return AttemptModel.getAttemptedQuestionIdsByUser(userId);
  },
};