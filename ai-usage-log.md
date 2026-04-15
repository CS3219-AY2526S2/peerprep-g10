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

