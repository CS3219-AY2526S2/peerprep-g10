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

// GET /questions — list all questions
router.get('/', async (req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM questions ORDER BY id');
  res.json(result.rows);
});

// GET /questions/:id — get a single question
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }

  res.json(result.rows[0]);
});

// POST /questions — create a new question
router.post('/', async (req: Request, res: Response) => {
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

// PUT /questions/:id — update a question
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, topics, difficulty, examples, pseudocode, image_url } = req.body;

  if (!title || !description || !topics || !difficulty) {
    res.status(400).json({ error: 'title, description, topics, and difficulty are required.' });
    return;
  }

  const result = await pool.query(
    `UPDATE questions SET title = $1, description = $2, topics = $3, difficulty = $4,
     examples = $5, pseudocode = $6, image_url = $7 WHERE id = $8 RETURNING *`,
    [title, description, topics, difficulty, examples ?? null, pseudocode ?? null, image_url ?? null, id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }

  res.json(result.rows[0]);
});

// DELETE /questions/:id — delete a question
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Question not found.' });
    return;
  }

  res.status(200).json({ message: 'Question deleted.' });
});

export default router;
