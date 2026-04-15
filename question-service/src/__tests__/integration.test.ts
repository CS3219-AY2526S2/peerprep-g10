// AI Assistance Disclosure:
// Tool: Claude, date: 2026-04-05 (PR #46), 2026-04-07 (PR #53)
// Scope: Generated the Testcontainers + Supertest integration harness
//   (Postgres container setup, schema initialisation, JWT signing, mocked
//   ban-check Redis client) and the initial test cases for the CRUD and
//   random-unattempted flows.
// Author review: Reviewed for correctness and integrated into the test suite.

import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import jwt from "jsonwebtoken";
import request from "supertest";
import type { Express } from "express";
import type { Pool } from "pg";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.SERVICE_SECRET_KEY = process.env.SERVICE_SECRET_KEY || "test-service-secret";

jest.mock("../config/authRedis", () => ({
  banCheckClient: {
    sIsMember: jest.fn().mockResolvedValue(false),
  },
}));

let pgContainer: StartedPostgreSqlContainer;
let app: Express;
let pool: Pool;

const createAdminAuthHeader = () => {
  const token = jwt.sign(
    { userId: 1, access_role: "admin" },
    process.env.JWT_SECRET as string
  );

  return { Authorization: `Bearer ${token}` };
};

beforeAll(async () => {
  pgContainer = await new PostgreSqlContainer("postgres:17").start();
  process.env.DATABASE_URL = pgContainer.getConnectionUri();

  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
  process.env.SERVICE_SECRET_KEY = process.env.SERVICE_SECRET_KEY || "test-service-secret";

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
    const res = await request(app)
      .post("/questions")
      .set(createAdminAuthHeader())
      .send(sampleQuestion);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe(sampleQuestion.title);
    expect(res.body.topics).toEqual(sampleQuestion.topics);
    expect(res.body.difficulty).toBe(sampleQuestion.difficulty);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/questions")
      .set(createAdminAuthHeader())
      .send({ title: "Incomplete" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe("GET /questions", () => {
  it("returns all questions", async () => {
    await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);
    await request(app).post("/questions").set(createAdminAuthHeader()).send({
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
    const created = await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);

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
    await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);

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
    await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);
    await request(app).post("/questions").set(createAdminAuthHeader()).send({
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
    const created = await request(app)
      .post("/questions")
      .set(createAdminAuthHeader())
      .send(sampleQuestion);

    const updated = {
      ...sampleQuestion,
      title: "Two Sum (Updated)",
      difficulty: "medium",
    };

    const res = await request(app)
      .put(`/questions/${created.body.id}`)
      .set(createAdminAuthHeader())
      .send(updated);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Two Sum (Updated)");
    expect(res.body.difficulty).toBe("medium");
  });

  it("returns 400 when required fields are missing", async () => {
    const created = await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);

    const res = await request(app)
      .put(`/questions/${created.body.id}`)
      .set(createAdminAuthHeader())
      .send({ title: "Incomplete" });

    expect(res.status).toBe(400);
  });

  it("returns 404 when question does not exist", async () => {
    const res = await request(app)
      .put("/questions/99999")
      .set(createAdminAuthHeader())
      .send(sampleQuestion);

    expect(res.status).toBe(404);
  });
});

describe("POST /questions/random-unattempted", () => {
  const endpoint = "/questions/random-unattempted";

  function mockCollabService(userAQuestionIds: string[], userBQuestionIds: string[]) {
    jest.spyOn(global, "fetch").mockImplementation((input) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      if (url.includes("user-a")) {
        return Promise.resolve(Response.json({ userId: "user-a", questionIds: userAQuestionIds }));
      }
      if (url.includes("user-b")) {
        return Promise.resolve(Response.json({ userId: "user-b", questionIds: userBQuestionIds }));
      }
      return Promise.resolve(Response.json({ userId: "unknown", questionIds: [] }));
    });
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns a matching unattempted question", async () => {
    const created = await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);
    mockCollabService([], []);

    const res = await request(app).post(endpoint).send({
      userAId: "user-a",
      userBId: "user-b",
      topics: ["Arrays"],
      difficulties: ["easy"],
    });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    expect(res.body.title).toBe(sampleQuestion.title);
  });

  it("excludes questions attempted by user A", async () => {
    const q1 = await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);
    const q2 = await request(app).post("/questions").set(createAdminAuthHeader()).send({
      ...sampleQuestion,
      title: "Three Sum",
      difficulty: "easy",
    });
    mockCollabService([String(q1.body.id)], []);

    const res = await request(app).post(endpoint).send({
      userAId: "user-a",
      userBId: "user-b",
      topics: ["Arrays"],
      difficulties: ["easy"],
    });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(q2.body.id);
  });

  it("excludes questions attempted by user B", async () => {
    const q1 = await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);
    const q2 = await request(app).post("/questions").set(createAdminAuthHeader()).send({
      ...sampleQuestion,
      title: "Three Sum",
      difficulty: "easy",
    });
    mockCollabService([], [String(q1.body.id)]);

    const res = await request(app).post(endpoint).send({
      userAId: "user-a",
      userBId: "user-b",
      topics: ["Arrays"],
      difficulties: ["easy"],
    });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(q2.body.id);
  });

  it("returns null when all matching questions are attempted", async () => {
    const q1 = await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);
    mockCollabService([String(q1.body.id)], []);

    const res = await request(app).post(endpoint).send({
      userAId: "user-a",
      userBId: "user-b",
      topics: ["Arrays"],
      difficulties: ["easy"],
    });

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  it("returns null when no questions match topics/difficulties", async () => {
    await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion);
    mockCollabService([], []);

    const res = await request(app).post(endpoint).send({
      userAId: "user-a",
      userBId: "user-b",
      topics: ["Nonexistent"],
      difficulties: ["hard"],
    });

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  it("filters by multiple difficulties", async () => {
    await request(app).post("/questions").set(createAdminAuthHeader()).send(sampleQuestion); // easy
    const q2 = await request(app).post("/questions").set(createAdminAuthHeader()).send({
      ...sampleQuestion,
      title: "Hard Problem",
      difficulty: "hard",
    });
    mockCollabService([], []);

    const res = await request(app).post(endpoint).send({
      userAId: "user-a",
      userBId: "user-b",
      topics: ["Arrays"],
      difficulties: ["hard"],
    });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(q2.body.id);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post(endpoint).send({ userAId: "user-a" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("returns 400 when topics is empty array", async () => {
    const res = await request(app).post(endpoint).send({
      userAId: "user-a",
      userBId: "user-b",
      topics: [],
      difficulties: ["easy"],
    });

    expect(res.status).toBe(400);
  });

  it("returns 502 when collab service is unavailable", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Connection refused"));

    const res = await request(app).post(endpoint).send({
      userAId: "user-a",
      userBId: "user-b",
      topics: ["Arrays"],
      difficulties: ["easy"],
    });

    expect(res.status).toBe(502);
    expect(res.body.error).toContain("unavailable");
  });

  it("returns 502 when collab service returns error status", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 500 }));

    const res = await request(app).post(endpoint).send({
      userAId: "user-a",
      userBId: "user-b",
      topics: ["Arrays"],
      difficulties: ["easy"],
    });

    expect(res.status).toBe(502);
  });
});

describe("DELETE /questions/:id", () => {
  it("deletes a question", async () => {
    const created = await request(app)
      .post("/questions")
      .set(createAdminAuthHeader())
      .send(sampleQuestion);

    const res = await request(app)
      .delete(`/questions/${created.body.id}`)
      .set(createAdminAuthHeader());
    expect(res.status).toBe(200);

    // Verify that it's gone
    const check = await request(app).get(`/questions/${created.body.id}`);
    expect(check.status).toBe(404);
  });

  it("returns 404 when question does not exist", async () => {
    const res = await request(app)
      .delete("/questions/99999")
      .set(createAdminAuthHeader());
    expect(res.status).toBe(404);
  });
});
