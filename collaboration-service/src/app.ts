import express, { Express, Request, Response } from "express";
import cors from "cors";
import { pool } from "./db";

export function createApp(): Express {
	const app: Express = express();

	app.use(cors({ origin: true, credentials: true }));
	app.use(express.json());

	// check health
	app.get("/health", (_req: Request, res: Response) => {
		res.status(200).json({ status: "Collaboration Service is running perfectly." });
	});

	// get caht history
	app.get("/rooms/:roomId/chat", async (req: Request, res: Response) => {
		try {
			const { roomId } = req.params;

	  		const result = await pool.query(
				`SELECT id,
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