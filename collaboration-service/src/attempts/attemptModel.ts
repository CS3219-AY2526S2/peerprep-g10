import { pool } from '../db';

export interface QuestionSnapshot {
  id: string;
  title: string;
  topics: string[];
  difficulty: string;
  description: string;
  examples: string;
  pseudocode: string;
  solution: string;
}

export const AttemptModel = {
  async createAttempt(data: {
    roomId: string;
    userId: string;
    partnerId: string;
    questionId: string;
    questionSnapshot: QuestionSnapshot | null;
    code: string;
    startedAt: Date;
    endedAt: Date;
  }) {
    const result = await pool.query(
      `INSERT INTO attempts (room_id, user_id, partner_id, question_id, question_snapshot, code, started_at, ended_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8)
       ON CONFLICT (room_id, user_id)
       DO UPDATE SET
         code = EXCLUDED.code,
         ended_at = EXCLUDED.ended_at,
         question_snapshot = EXCLUDED.question_snapshot
       RETURNING
         id,
         room_id AS "roomId",
         user_id AS "userId",
         partner_id AS "partnerId",
         question_id AS "questionId",
         question_snapshot AS "questionSnapshot",
         code,
         started_at AS "startedAt",
         ended_at AS "endedAt",
         created_at AS "createdAt"`,
      [
        data.roomId,
        data.userId,
        data.partnerId,
        data.questionId,
        data.questionSnapshot,
        data.code,
        data.startedAt,
        data.endedAt,
      ]
    );
    return result.rows[0];
  },

  async getAttemptsByUser(userId: string) {
    const result = await pool.query(
      `SELECT
         id,
         room_id AS "roomId",
         user_id AS "userId",
         partner_id AS "partnerId",
         question_id AS "questionId",
         question_snapshot AS "questionSnapshot",
         code,
         started_at AS "startedAt",
         ended_at AS "endedAt",
         created_at AS "createdAt"
       FROM attempts
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async getAttemptById(id: string) {
    const result = await pool.query(
      `SELECT
         id,
         room_id AS "roomId",
         user_id AS "userId",
         partner_id AS "partnerId",
         question_id AS "questionId",
         question_snapshot AS "questionSnapshot",
         code,
         started_at AS "startedAt",
         ended_at AS "endedAt",
         created_at AS "createdAt"
       FROM attempts
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  async getAttemptedQuestionIdsByUser(userId: string): Promise<string[]> {
    const result = await pool.query(
      `SELECT DISTINCT question_id AS "questionId"
       FROM attempts
       WHERE user_id = $1
       ORDER BY question_id ASC`,
      [userId]
    );
    return result.rows.map((r) => r.questionId);
  },
};
