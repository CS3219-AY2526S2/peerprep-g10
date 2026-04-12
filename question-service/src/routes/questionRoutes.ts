import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken, requireAuth } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.get('/topics', async (req: Request, res: Response) => {
  const result = await pool.query(
    'SELECT DISTINCT unnest(topics) AS topic FROM questions ORDER BY topic'
  );
  res.json({ topics: result.rows.map((r) => r.topic) });
});

router.post('/random-unattempted', async (req: Request, res: Response) => {
  const { userAId, userBId, topics, difficulties } = req.body;

  if (!userAId || !userBId || !Array.isArray(topics) || !topics.length || !Array.isArray(difficulties) || !difficulties.length) {
    res.status(400).json({ error: 'userAId, userBId, topics (non-empty array), and difficulties (non-empty array) are required.' });
    return;
  }

  const collabServiceUrl = process.env.COLLABORATION_SERVICE_URL || 'http://localhost:3001';
  const serviceToken = process.env.SERVICE_SECRET_KEY;

  if (!serviceToken) {
    res.status(500).json({ error: 'Service secret is not configured' });
    return;
  }

  const serviceHeaders = {
    Authorization: `Bearer ${serviceToken}`,
  };

  let attemptedIntIds: number[] = [];
  try {
    const [userARes, userBRes] = await Promise.all([
      fetch(`${collabServiceUrl}/attempts/user/${encodeURIComponent(userAId)}/questions`, { headers: serviceHeaders }),
      fetch(`${collabServiceUrl}/attempts/user/${encodeURIComponent(userBId)}/questions`, { headers: serviceHeaders }),
    ]);

    if (!userARes.ok || !userBRes.ok) {
      res.status(502).json({ error: 'Failed to fetch attempted questions from collaboration service.' });
      return;
    }

    const userAData = await userARes.json() as { questionIds: string[] };
    const userBData = await userBRes.json() as { questionIds: string[] };

    attemptedIntIds = [...new Set([...userAData.questionIds, ...userBData.questionIds])]
      .map(Number)
      .filter((n) => !isNaN(n));
  } catch {
    res.status(502).json({ error: 'Collaboration service is unavailable.' });
    return;
  }

  const hasExclusions = attemptedIntIds.length > 0;
  const query = `
    SELECT * FROM questions
    WHERE topics && $1::text[]
      AND difficulty = ANY($2::difficulty_level[])
      ${hasExclusions ? 'AND id != ALL($3::int[])' : ''}
    ORDER BY RANDOM()
    LIMIT 1
  `;
  const params: (string[] | number[])[] = [topics, difficulties];
  if (hasExclusions) params.push(attemptedIntIds);

  const result = await pool.query(query, params);

  res.json(result.rows[0] ?? null);
});

router.get('/random', async (req: Request, res: Response) => {
  const { topic, difficulty } = req.query;

  if (!topic || !difficulty) {
    res.status(400).json({ error: 'Both topic and difficulty query parameters are required.' });
    return;
  }

  const result = await pool.query(
    'SELECT * FROM questions WHERE topics @> $1::text[] AND difficulty = $2 ORDER BY RANDOM() LIMIT 1',
    [[topic], difficulty]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'No question found matching the given topic and difficulty.' });
    return;
  }

  res.json(result.rows[0]);
});

// GET /questions — list all questions (user and admin — ban check applied)
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM questions ORDER BY id');
  res.json(result.rows);
});

// GET /questions/:id — get a single question (user and admin — ban check applied)
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }

  res.json(result.rows[0]);
});

// POST /questions — create a new question (admin only — requires JWT + role check + ban check)
router.post('/', requireAuth, authorizeRoles('admin'), async (req: Request, res: Response) => {
  const { title, description, topics, difficulty, examples, pseudocode, image_url } = req.body;

  if (!title || !description || !topics || !difficulty) {
    res.status(400).json({ error: 'title, description, topics, and difficulty are required.' });
    return;
  }

  const result = await pool.query(
    `INSERT INTO questions (title, description, topics, difficulty, examples, pseudocode, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [title, description, topics, difficulty, examples ?? null, pseudocode ?? null, image_url ?? null]
  );

  res.status(201).json(result.rows[0]);
});

// PUT /questions/:id — update a question (admin only — requires JWT + role check + ban check)
router.put('/:id', requireAuth, authorizeRoles('admin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, topics, difficulty, examples, pseudocode, image_url } = req.body;

  if (!title || !description || !topics || !difficulty) {
    res.status(400).json({ error: 'title, description, topics, and difficulty are required.' });
    return;
  }

  const result = await pool.query(
    `UPDATE questions SET title = $1, description = $2, topics = $3, difficulty = $4,
     examples = $5, pseudocode = $6, image_url = $7, updated_at = NOW() WHERE id = $8 RETURNING *`,
    [title, description, topics, difficulty, examples ?? null, pseudocode ?? null, image_url ?? null, id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }

  res.json(result.rows[0]);
});

// DELETE /questions/:id — delete a question (admin only — requires JWT + role check + ban check)
router.delete('/:id', requireAuth, authorizeRoles('admin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }

  res.status(200).json({ message: 'Question deleted.' });
});

export default router;
