import { pool } from '../db';

export const AttemptModel = {
  async createAttempt(data: {
    roomId: string;
    userId: string;
    partnerId: string;
    questionId: string;
    code: string;
    startedAt: Date;
    endedAt: Date;
  }) {
    const result = await pool.query(
      `INSERT INTO attempts (room_id, user_id, partner_id, question_id, code, started_at, ended_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (room_id, user_id)
       DO UPDATE SET
         code = EXCLUDED.code,
         ended_at = EXCLUDED.ended_at
       RETURNING
         id,
         room_id AS "roomId",
         user_id AS "userId",
         partner_id AS "partnerId",
         question_id AS "questionId",
         code,
         started_at AS "startedAt",
         ended_at AS "endedAt",
         created_at AS "createdAt"`,
      [data.roomId, data.userId, data.partnerId, data.questionId, data.code, data.startedAt, data.endedAt]
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
};
