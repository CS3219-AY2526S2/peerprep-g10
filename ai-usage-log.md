# AI Usage Log

# Wen Cong

## Entry 1
matching-service/src/app.ts, matching-service/src/config/redis.ts, matching-service/src/services/queue.service.ts
# Date/Time:
2026-03-06
# Tool:
GitHub Copilot (model: GPT-5.3-Codex)
# Prompt/Command:
"Generate and refine backend boilerplate for matching-service app setup, Redis client initialization, and queue helper operations."
# Scope:
I used Copilot to draft and clean up implementation code for app setup, Redis initialization, and queue helper logic.
# Output Summary:
I got starter code for service setup and queue utilities, then refined it for this codebase.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I reviewed each suggestion, kept what matched our existing code style, and tested middleware and Redis behavior locally.

## Entry 2
matching-service/src/services/matching.service.ts
# Date/Time:
2026-03-07
# Tool:
GitHub Copilot (model: GPT-5.3-Codex)
# Prompt/Command:
"Implement and refactor candidate matching logic for matching-service, including partner selection and service-to-service orchestration."
# Scope:
I used Copilot for implementation help while refactoring candidate matching and partner selection flow.
# Output Summary:
It suggested a baseline matching flow with candidate filtering and orchestration hooks.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I walked through the matching flow step by step, adjusted the selection behavior, and verified events manually.

## Entry 3
matching-service/src/clients/question.client.ts
# Date/Time:
2026-03-13
# Tool:
GitHub Copilot (model: GPT-5.3-Codex)
# Prompt/Command:
"Create question-service client scaffolding with typed response handling and resilient error handling patterns."
# Scope:
I used Copilot to draft the question-service client methods and improve error handling code.
# Output Summary:
It produced a first pass of the client structure for random question fetching and error handling.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I checked query params and typing against the current API contract and fixed details before keeping the changes.

## Entry 4
matching-service/src/server.ts, matching-service/src/clients/collab.client.ts, peerprep-frontend/src/app/user/page.tsx
# Date/Time:
2026-03-23
# Tool:
GitHub Copilot (model: GPT-5.3-Codex)
# Prompt/Command:
"Refactor Socket.IO server event wiring, collaboration-session client request flow, and user dashboard match criteria state handling."
# Scope:
I used Copilot to help refactor Socket.IO event wiring, collab-client request flow, and dashboard state handling.
# Output Summary:
It suggested refactoring patterns for backend event flow and frontend handler logic.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I adapted the suggestions to existing code paths and validated behavior with local runs.

## Entry 5
peerprep-frontend/src/hooks/useMatchingSession.ts
# Date/Time:
2026-03-26
# Tool:
GitHub Copilot (model: GPT-5.3-Codex)
# Prompt/Command:
"Refactor useMatchingSession hook to manage socket lifecycle, timeout handling, notification flow, and connection error paths."
# Scope:
I used Copilot while refactoring the hook's socket lifecycle, timeout logic, and notification flow.
# Output Summary:
It suggested timer cleanup patterns and event/error handling structure for the hook.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I rewired callbacks and message handling to fit the current UX, then tested matching and forced logout locally.

## Entry 6
infra/main.tf, infra/variables.tf, infra/outputs.tf, infra/wif.tf, infra/modules/artifact_registry/main.tf, infra/modules/cloud_run/main.tf, infra/modules/databases/main.tf, infra/modules/load_balancer/main.tf, infra/modules/networking/main.tf, infra/modules/secrets/main.tf
# Date/Time:
2026-04-08
# Tool:
GitHub Copilot (model: GPT-5.3-Codex)
# Prompt/Command:
"Generate and refactor Terraform implementation blocks for provider/module wiring, variable/output declarations, workload-identity resources, backend config entries, and reusable module resource definitions; suggest fixes for terraform syntax/runtime issues."
# Scope:
I used Copilot for implementation support while writing/refactoring Terraform blocks and troubleshooting validation issues.
# Output Summary:
It gave me draft Terraform blocks and syntax/debugging suggestions, which I then adjusted to match our setup.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I reviewed every snippet, edited values and wiring for our current infra, and ran Terraform checks/plan before keeping changes.

## Entry 7
.github/workflows/deployment-staging.yml, .github/workflows/deployment-prod.yml
# Date/Time:
2026-04-12
# Tool:
GitHub Copilot (model: GPT-5.3-Codex)
# Prompt/Command:
"Refactor GitHub Actions implementation details for deployment workflow job sequencing, conditions, outputs, and command steps; suggest debugging fixes for workflow syntax and execution issues."
# Scope:
I used Copilot to refactor workflow YAML steps, conditionals, and job flow, plus troubleshoot syntax/execution issues.
# Output Summary:
It suggested edits for workflow syntax and step wiring in staging and production pipelines.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I checked trigger conditions and job dependencies, edited commands to match our scripts, and validated workflow syntax.

# Kang Jun

## Entry 1
question-service/src/init-db.ts
# Date/Time:
2026-03-08
# Tool:
Claude (model: Sonnet 4.5)
# Prompt/Command:
"Translate this hand-designed schema for a `questions` table (SERIAL id, unique title, description, TEXT[] topics with GIN index, difficulty enum, examples/pseudocode/solution/image_url, timestamps) into Postgres DDL."
# Scope:
I used Claude to convert my schema design into the actual DDL statements.
# Output Summary:
It produced the `CREATE TYPE` / `CREATE TABLE` / `CREATE INDEX` statements matching the design.
# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected
# Author Notes:
I verified the DDL against the schema I had planned and ran it locally to confirm the indexes behaved as expected.

## Entry 2
question-service/src/routes/questionRoutes.ts
# Date/Time:
2026-03-08
# Tool:
Claude (model: Sonnet 4.5)
# Prompt/Command:
"Generate Express CRUD routes for list/get/create/update/delete against the `questions` table using `pg`, with input validation."
# Scope:
I used Claude to draft the initial CRUD route handlers for the question service.
# Output Summary:
It produced a first pass of the CRUD Express router.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I adjusted the handlers to plug into our auth/role middleware conventions and tightened error responses before merging.

## Entry 3
peerprep-frontend/src/components/admin/QuestionForm.tsx, peerprep-frontend/src/components/admin/QuestionTable.tsx, peerprep-frontend/src/services/questionApi.ts, peerprep-frontend/src/app/admin/questions/create/page.tsx, peerprep-frontend/src/app/admin/questions/[id]/edit/page.tsx
# Date/Time:
2026-03-11
# Tool:
Claude (model: Sonnet 4.5)
# Prompt/Command:
"Generate a Next.js admin dashboard for question CRUD: a QuestionForm with title/description/examples/difficulty/topics/pseudocode/solution inputs, a QuestionTable with edit/delete actions, a fetch-based API client, and create/edit pages wiring them together, styled with Tailwind."
# Scope:
I used Claude to generate the admin question CRUD UI, API client, and the create/edit pages.
# Output Summary:
It produced the form, table, API client, and two page components in Tailwind-styled React.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I reviewed types, adjusted routing constants, and verified the UI against the backend before keeping the code.

## Entry 4
.github/workflows/ci.yml, question-service/src/__tests__/integration.test.ts
# Date/Time:
2026-04-05
# Tool:
Claude (model: Sonnet 4.5)
# Prompt/Command:
"Translate this hand-designed CI pipeline (paths-filter → per-service matrix of npm ci/typecheck/test/build, frontend lint+build, Docker image verify) into GitHub Actions YAML, and generate a Testcontainers + Supertest integration harness for question-service with initial CRUD test cases."
# Scope:
I used Claude to convert my CI design into YAML and to scaffold the integration test harness.
# Output Summary:
It produced the GitHub Actions workflow and a Testcontainers-backed integration test file.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I adjusted service paths, Node version, and added edge-case coverage before merging.

## Entry 5
question-service/src/seed.ts
# Date/Time:
2026-04-05
# Tool:
Claude (model: Sonnet 4.5)
# Prompt/Command:
"Given these LeetCode questions from the Kaggle dataset (https://www.kaggle.com/datasets/gzipchrist/leetcode-problem-dataset) which lacks worked answers, generate model solutions for the Sort and Stacks/Queues topics matching the existing Question interface."
# Scope:
I used Claude to generate model solutions for questions where the Kaggle source did not include answers.
# Output Summary:
It produced worked solutions and example blocks for the requested topic batches.
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
I reviewed each solution for correctness, trimmed/reformatted content to match the schema, and validated via the seed script against the integration test suite.

## Entry 6
question-service/src/routes/questionRoutes.ts, question-service/src/__tests__/integration.test.ts
# Date/Time:
2026-04-07
# Tool:
Claude (model: Sonnet 4.5)
# Prompt/Command:
"Add a `/random-unattempted` endpoint that takes { userAId, userBId, topics, difficulties }, calls the collaboration service for each user's attempted question IDs, and picks a random matching question neither has attempted; include integration tests using nock."
# Scope:
I used Claude to generate the random-unattempted endpoint and its integration tests.
# Output Summary:
It produced the new endpoint plus the corresponding test cases.
# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected
# Author Notes:
I verified the service-to-service call and confirmed the tests ran green locally and in CI.

