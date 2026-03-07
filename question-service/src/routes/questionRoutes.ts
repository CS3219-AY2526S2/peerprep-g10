import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/topics', async (req: Request, res: Response) => {
  const result = await pool.query(
    'SELECT DISTINCT unnest(topics) AS topic FROM questions ORDER BY topic'
  );
  res.json({ topics: result.rows.map((r) => r.topic) });
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

export default router;
