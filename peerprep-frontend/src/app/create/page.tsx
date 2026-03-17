"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TestCase = {
  input: string;
  expectedOutput: string;
};

export default function CreateRoomPage() {
  const router = useRouter();

  const [title, setTitle] = useState("Two Sum");
  const [topic, setTopic] = useState("Hash Table");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState(
    "Given an array of integers and a target integer, return the indices of the two numbers such that they add up to the target."
  );
  const [codeExample, setCodeExample] = useState(
    "nums = [2,7,11,15]\ntarget = 9\nprint(two_sum(nums, target))\n# [0,1]"
  );
  const [starterCode, setStarterCode] = useState(
    "def two_sum(nums, target):\n    pass"
  );
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "[2,7,11,15], 9", expectedOutput: "[0,1]" },
    { input: "[3,2,4], 6", expectedOutput: "[1,2]" },
  ]);
  const [userId, setUserId] = useState("user1");
  const [loading, setLoading] = useState(false);

  function updateTestCase(index: number, field: keyof TestCase, value: string) {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    );
  }

  function addTestCase() {
    setTestCases((prev) => [...prev, { input: "", expectedOutput: "" }]);
  }

  function removeTestCase(index: number) {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  }

  async function createRoom() {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          topic,
          difficulty,
          description,
          codeExample,
          starterCode,
          testCases,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create room");
      }

      router.push(`/room/${data.id}?user=${encodeURIComponent(userId)}`);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <h1>Create Collaboration Room</h1>

      <div style={{ display: "grid", gap: 12 }}>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Your user ID" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Question title" />
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
        <input value={difficulty} onChange={(e) => setDifficulty(e.target.value)} placeholder="Difficulty" />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Question description"
          rows={5}
        />

        <textarea
          value={codeExample}
          onChange={(e) => setCodeExample(e.target.value)}
          placeholder="Code example"
          rows={5}
        />

        <textarea
          value={starterCode}
          onChange={(e) => setStarterCode(e.target.value)}
          placeholder="Starter code"
          rows={8}
        />

        <div>
          <h2>Test Cases</h2>
          {testCases.map((tc, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
                display: "grid",
                gap: 8,
              }}
            >
              <input
                value={tc.input}
                onChange={(e) => updateTestCase(index, "input", e.target.value)}
                placeholder="Input"
              />
              <input
                value={tc.expectedOutput}
                onChange={(e) => updateTestCase(index, "expectedOutput", e.target.value)}
                placeholder="Expected output"
              />
              <button type="button" onClick={() => removeTestCase(index)}>
                Remove test case
              </button>
            </div>
          ))}

          <button type="button" onClick={addTestCase}>
            Add test case
          </button>
        </div>

        <button type="button" onClick={createRoom} disabled={loading}>
          {loading ? "Creating..." : "Create Room"}
        </button>
      </div>
    </main>
  );
}