import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import request from "supertest";
import type { Express } from "express";
import type { Pool } from "pg";

let pgContainer: StartedPostgreSqlContainer;
let app: Express;
let pool: Pool;

beforeAll(async () => {
  pgContainer = await new PostgreSqlContainer("postgres:17").start();
  process.env.DATABASE_URL = pgContainer.getConnectionUri();

  // Require modules after setting DATABASE_URL (pool reads it at import time)
  const { initDb } = require("../init-db");
  await initDb();

  pool = require("../db").default;
  app = require("../app").default;
}, 60_000);

afterAll(async () => {
  if (pool) await pool.end();
  if (pgContainer) await pgContainer.stop();
});

beforeEach(async () => {
  await pool.query("DELETE FROM questions");
});

const sampleQuestion = {
  title: "Two Sum",
  description: "Given an array of integers, return indices of the two numbers such that they add up to a target.",
  topics: ["Arrays", "Hash Table"],
  difficulty: "easy",
  examples: "Input: [2,7,11,15], target=9 Output: [0,1]",
  pseudocode: "Use a hash map to store complements.",
};

describe("GET /health", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBeDefined();
  });
});

describe("POST /questions", () => {
  it("creates a question", async () => {
    const res = await request(app).post("/questions").send(sampleQuestion);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe(sampleQuestion.title);
    expect(res.body.topics).toEqual(sampleQuestion.topics);
    expect(res.body.difficulty).toBe(sampleQuestion.difficulty);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/questions")
      .send({ title: "Incomplete" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe("GET /questions", () => {
  it("returns all questions", async () => {
    await request(app).post("/questions").send(sampleQuestion);
    await request(app).post("/questions").send({
      ...sampleQuestion,
      title: "Three Sum",
    });

    const res = await request(app).get("/questions");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("returns empty array when no questions exist", async () => {
    const res = await request(app).get("/questions");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("GET /questions/:id", () => {
  it("returns the question when found", async () => {
    const created = await request(app).post("/questions").send(sampleQuestion);

    const res = await request(app).get(`/questions/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(sampleQuestion.title);
  });

  it("returns 404 when not found", async () => {
    const res = await request(app).get("/questions/99999");
    expect(res.status).toBe(404);
  });
});

describe("GET /questions/random", () => {
  it("returns a matching question", async () => {
    await request(app).post("/questions").send(sampleQuestion);

    const res = await request(app)
      .get("/questions/random")
      .query({ topic: "Arrays", difficulty: "easy" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(sampleQuestion.title);
  });

  it("returns 400 when params are missing", async () => {
    const res = await request(app).get("/questions/random");
    expect(res.status).toBe(400);
  });

  it("returns 404 when no question matches", async () => {
    const res = await request(app)
      .get("/questions/random")
      .query({ topic: "Nonexistent", difficulty: "hard" });

    expect(res.status).toBe(404);
  });
});

describe("GET /questions/topics", () => {
  it("returns distinct topics", async () => {
    await request(app).post("/questions").send(sampleQuestion);
    await request(app).post("/questions").send({
      ...sampleQuestion,
      title: "Binary Search",
      topics: ["Arrays", "Binary Search"],
    });

    const res = await request(app).get("/questions/topics");
    expect(res.status).toBe(200);
    expect(res.body.topics).toContain("Arrays");
    expect(res.body.topics).toContain("Hash Table");
    expect(res.body.topics).toContain("Binary Search");
    // "Arrays" appears in both questions but should only be listed once
    expect(
      res.body.topics.filter((t: string) => t === "Arrays")
    ).toHaveLength(1);
  });
});

describe("PUT /questions/:id", () => {
  it("updates a question", async () => {
    const created = await request(app).post("/questions").send(sampleQuestion);

    const updated = {
      ...sampleQuestion,
      title: "Two Sum (Updated)",
      difficulty: "medium",
    };

    const res = await request(app)
      .put(`/questions/${created.body.id}`)
      .send(updated);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Two Sum (Updated)");
    expect(res.body.difficulty).toBe("medium");
  });

  it("returns 400 when required fields are missing", async () => {
    const created = await request(app).post("/questions").send(sampleQuestion);

    const res = await request(app)
      .put(`/questions/${created.body.id}`)
      .send({ title: "Incomplete" });

    expect(res.status).toBe(400);
  });

  it("returns 404 when question does not exist", async () => {
    const res = await request(app)
      .put("/questions/99999")
      .send(sampleQuestion);

    expect(res.status).toBe(404);
  });
});

describe("DELETE /questions/:id", () => {
  it("deletes a question", async () => {
    const created = await request(app).post("/questions").send(sampleQuestion);

    const res = await request(app).delete(`/questions/${created.body.id}`);
    expect(res.status).toBe(200);

    // Verify it's gone
    const check = await request(app).get(`/questions/${created.body.id}`);
    expect(check.status).toBe(404);
  });

  it("returns 404 when question does not exist", async () => {
    const res = await request(app).delete("/questions/99999");
    expect(res.status).toBe(404);
  });
});
