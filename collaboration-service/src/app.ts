import express, { Express, Request, Response } from "express";
import cors from "cors";
import { pool } from "./db";
import attemptRoutes from "./attempts/attemptRoutes"; 

type TestCase = {
  input: string;
  expectedOutput: string;
};

function isValidTestCases(value: unknown): value is TestCase[] {
  if (!Array.isArray(value)) return false;

  return value.every(
    (tc) =>
      tc &&
      typeof tc === "object" &&
      typeof tc.input === "string" &&
      typeof tc.expectedOutput === "string"
  );
}

export function createApp(): Express {
  const app: Express = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "Collaboration Service is running perfectly." });
  });

  // Mount attempt routes
  app.use("/attempts", attemptRoutes);

  app.post("/rooms", async (req: Request, res: Response) => {
    try {
      const {questionId, user1Id, user2Id} = req.body;

      if (
        (typeof questionId !== "number" && typeof questionId !== "string") ||
        typeof user1Id !== "string" ||
        typeof user2Id !== "string"
      ) {
        return res.status(400).json({
          error: "questionId, user1Id, and user2Id are required",
        });
      }

      const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || "http://localhost:3003";

      const response = await fetch(`${QUESTION_SERVICE_URL}/questions/${questionId}`);

      if (!response.ok) {
        return res.status(400).json({ error: "Invalid questionId" });
      }

      const question = await response.json();

      console.log("Question service response:", question);
      console.log("Question testCases:", question.testCases);

      const title = question.title;
      const topics = Array.isArray(question.topics) ? 
      question.topics.filter((t: unknown): t is string => typeof t === "string") : [];
      const difficulty = question.difficulty;
      const description = question.description;
      const starterCode = question.pseudocode ?? "";
      const testCases: TestCase[] = Array.isArray(question.testCases) ? question.testCases.filter(
        (tc: any) =>
          tc &&
          typeof tc.input === "string" &&
          typeof tc.expectedOutput === "string"
      ) : [];

      if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof starterCode !== "string" ||
        !isValidTestCases(testCases) ||
        !Array.isArray(topics)
      ) {
        return res.status(400).json({
          error:
            "Invalid payload. title, description, starterCode must be strings, and testCases must be an array of { input, expectedOutput } and topics must be an array of topic.",
        });
      }

      const trimmedTitle = title.trim();
      const trimmedDescription = description.trim();
      const trimmedStarterCode = starterCode;
      const trimmedDifficulty = difficulty.trim();
      const trimmedTopics = topics.map((t) => t.trim()).filter(Boolean);

      if (!trimmedTitle || !trimmedDescription) {
        return res.status(400).json({
          error: "title, description, and starterCode cannot be empty",
        });
      }

      const result = await pool.query(
        `INSERT INTO rooms (
          question_id,
          title,
          topics,
          difficulty,
          description,
          starter_code,
          current_code,
          test_cases,
          user1_id,
          user2_id
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10)
        RETURNING
          id,
          question_id as "questionId",
          title,
          topics,
          difficulty,
          description,
          starter_code as "starterCode",
          current_code as "currentCode",
          test_cases as "testCases",
          created_at as "createdAt"`,
        [
          String(questionId),
          trimmedTitle,
          trimmedTopics,
          trimmedDifficulty || null,
          trimmedDescription,
          trimmedStarterCode,
          trimmedStarterCode,
          JSON.stringify(testCases),
          user1Id,
          user2Id,
        ]
      );

      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("POST /rooms failed:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/rooms/:roomId", async (req: Request, res: Response) => {
    try {
      const { roomId } = req.params;

      const result = await pool.query(
        `SELECT
          id,
          question_id as "questionId",
          title,
          topics,
          difficulty,
          description,
          starter_code as "starterCode",
          current_code as "currentCode",
          test_cases as "testCases",
          user1_id as "user1Id",
          user2_id as "user2Id",
          created_at as "createdAt"
        FROM rooms
        WHERE id = $1`,
        [roomId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Room not found" });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error("GET /rooms/:roomId failed:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/rooms/:roomId/chat", async (req: Request, res: Response) => {
    try {
      const { roomId } = req.params;

      const result = await pool.query(
        `SELECT
          id,
          room_id as "roomId",
          user_id as "userId",
          message,
          created_at as "createdAt"
        FROM chat_messages
        WHERE room_id = $1
        ORDER BY created_at ASC`,
        [roomId]
      );

      res.json(result.rows);
    } catch (err) {
      console.error("GET /rooms/:roomId/chat failed:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
}
