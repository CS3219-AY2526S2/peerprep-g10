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


# Yan Xu

## Entry 1
collaboration-service\src\realtime.ts collaboration-service\src\app.ts collaboration-service\src\index.ts peerprep-frontend\src\app\collaboration\[roomId]\page.tsx peerprep-frontend\src\app\collaboration\[roomId]\room.module.css peerprep-frontend\src\components\collaboration\CodeEditor.tsx
# Date/Time:
2026-03-12
# Tool:
ChatGPT 5.3
# Prompt/Command:
"I am working on an application called PeerPrep. It is a collaborative app that enables user to do leetcode style coding questions. In particular I need help with the collaboration page. This ![1776272905952](image/ai-usage-log/1776272905952.png) is what my group have imagined the collaboration page to be. We plan to use Express, TypeScript, PostgreSQL. For the code editor we have found CodeMirror to be suitable. Could you help me get started?"
# Scope:
I used ChatGPT to generate a initial base code for the collaboration frontend and backend
# Output Summary:
It provided me with the initial code for collaboration frontend and backend
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
The initial code is not what was envisioned and was full of bugs. It is heavily modified as the project progresses

## Entry 2
collaboration-service\Dockerfile
# Date/Time:
2026-03-23
# Tool:
ChatGPT 5.3
# Prompt/Command:
"Based on your understanding of my peerprep project, could you help me generate a Dockerfile?"
# Scope:
I used ChatGPT to generate a Dockerfile for the collaboration service
# Output Summary:
It provided me with the Dockerfile
# Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected
# Author Notes:
The Dockerfile is kept as is as it works well

## Entry 3
peerprep-frontend\src\components\collaboration\VoiceChat.tsx collaboration-service\src\realtime.ts peerprep-frontend\src\app\collaboration\[roomId]\page.tsx
# Date/Time:
2026-03-28
# Tool:
ChatGPT 5.3
# Prompt/Command:
"For the peerprep project I want to implement a voice call feature as we want users to be able to communicate so that they can effectively collaborate. For the voice call I wanted to use WebRTC. Could you help me get started?"
# Scope:
I used ChatGPT to generate a initial base code for the voice call feature as well as help in integrating with the collaboration frontend and backend
# Output Summary:
It provided me with the initial code for the voice call feature, as well as showed me how to integrate with the collaboration frontend and backend
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
The initial code is modified to get the integration to work. Furthermore more changes are added as the project progresses

## Entry 4
nginx\default.conf
# Date/Time:
2026-03-28
# Tool:
ChatGPT 5.3
# Prompt/Command:
"The Voice call feature requires HTTPS to work. As the services of peerprep are currently hosted on HTTP, could you help me generate a nginx configuration file to reverse proxy all the traffic onto HTTPS? The collaboration service is on http://collaboration-service:3001/, the frontend is on http://peerprep-frontend:3000/, the matching service is on http://matching-service:3002/, the user service is on http://user-service:3004/ and the question service is on http://question-service:3003/"
# Scope:
I used ChatGPT to generate a initial base NGINX configuration file to get voice call to work
# Output Summary:
It provided me with the initial base NGINX configuration file with routes to each of the services
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
The initial code is modified as the project progresses

## Entry 5
peerprep-frontend\src\components\collaboration\SocketIO-YJS-provider.ts collaboration-service\src\realtime.ts peerprep-frontend\src\app\collaboration\[roomId]\page.tsx
# Date/Time:
2026-03-30
# Tool:
ChatGPT 5.3
# Prompt/Command:
"The code editor is currently only replacing the code when a user types. Could you help me with the implementation of the YJS backbone with CRDT for the code editor?"
# Scope:
I used ChatGPT to generate a initial base code for the YJS code editor backbone and integration with the collaboration service backend and frontend
# Output Summary:
It provided me with the initial base code for the YJS code editor backbone and how to integrate with the collaboration service backend and frontend
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
The initial code is modified as the project progresses

## Entry 6
collaboration-service/src/__tests__/attempts/collaboration.test.ts
# Date/Time:
2026‑04‑14
# Tool:
ChatGPT 5.4
# Prompt/Command:
"Could you help me generate some test for the collaboration service?"
# Scope:
I used ChatGPT to generate some tests for the collaboration service
# Output Summary:
It provided me with the tests
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
The initial tests is changed while debugging

## Entry 7
collaboration-service\jest.config.js
# Date/Time:
2026‑04‑14
# Tool:
ChatGPT 5.4
# Prompt/Command:
"I have some errors with running the collaboration service tests. Could you help me configure Jest to handle dependencies such as yjs, y-protocols, and lib0?"
# Scope:
I used ChatGPT to generate the regex to handle yjs, y-protocols, and lib0 dependencies and install the correct dependencies
# Output Summary:
It provided me with the initial regex
# Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected
# Author Notes:
The output is not used directly as-is. I adjusted the Jest configuration while debugging and verified the final setup by rerunning the collaboration service tests
