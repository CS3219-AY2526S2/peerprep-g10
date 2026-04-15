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


# Derek Qua

## Entry 1: Verify Email (SVG/Icon)
**File:** peerprep-frontend/src/app/auth/verify-email/page.tsx

## Date/Time:
2026-04-02

## Tool:
Claude

## Prompt/Command:
"Create a React SVG component for a verify email page icon/illustration. It should represent email verification status in a clean minimal style suitable for a Next.js frontend empty/feedback state."

## Output Summary:
Generated a React-compatible SVG component representing email verification status. The design was minimal, scalable, and suitable for use in a verification feedback UI.

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated SVG into verify email page UI and used it directly without modification.

---

## Entry 2: Attempt History (Empty State SVG)
**File:** peerprep-frontend/src/components/attempt/AttemptHistoryTable.tsx

## Date/Time:
2026-04-05

## Tool:
Claude

## Prompt/Command:
"Generate a React SVG component for an empty state in a User Attempt History page. It should visually represent no past attempts (e.g., empty document, clock, or history icon) in a minimal and clean style."

## Output Summary:
Generated a React SVG component for an empty state UI in the Attempt History page.

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated SVG directly into Attempt History empty state without changes.

---

## Entry 3: Forbidden Page (SVG/Icon)
**File:** peerprep-frontend/src/components/ForbiddenPage.tsx

## Date/Time:
2026-04-11

## Tool:
Claude

## Prompt/Command:
"Create a React SVG component for a forbidden/access denied page. It should visually represent restricted access (e.g., lock, shield, or blocked symbol) in a minimal and clean style suitable for a Next.js frontend."

## Output Summary:
Generated a React SVG component representing a forbidden/access denied state.

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Used SVG directly in forbidden page without modification.

---

## Entry 4: ESLint + React Hooks Debugging
**File:** peerprep-frontend/src/context/AuthContext.tsx, peerprep-frontend/src/components/admin/QuestionsTab.tsx, peerprep-frontend/src/components/admin/UsersTab.tsx, peerprep-frontend/src/components/profile/EditProfileModal.tsx, peerprep-frontend/src/app/admin/page.tsx

## Date/Time:
2026-04-06 21:00

## Tool:
ChatGPT (GPT-5.3)

## Prompt/Command:
"Help me fix ESLint errors in my Next.js TypeScript project, including react-hooks/set-state-in-effect, no-explicit-any, and unescaped entities errors."

## Output Summary:
Explained causes of ESLint errors and suggested fixes including:
- Avoid calling setState directly inside useEffect
- Replace `any` with proper TypeScript types
- Escape special characters in JSX
- Fix missing dependencies in useEffect
- Suggested replacing `<img>` with Next.js `<Image />`

## Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

## Author Notes:
Applied fixes across multiple frontend files. Refactored state logic, improved typing, and resolved lint issues after testing.

---

## Entry 5: React Hooks Refactoring
**File:** peerprep-frontend/src/context/AuthContext.tsx, peerprep-frontend/src/components/admin/QuestionsTab.tsx, peerprep-frontend/src/components/admin/UsersTab.tsx, peerprep-frontend/src/components/profile/EditProfileModal.tsx, peerprep-frontend/src/app/admin/page.tsx

## Date/Time:
2026-04-06 21:10

## Tool:
ChatGPT (GPT-5.3)

## Prompt/Command:
"How to fix react-hooks/set-state-in-effect error when setting state based on searchParams or props?"

## Output Summary:
Suggested alternative patterns:
- Derive state directly instead of using useEffect
- Use useMemo or conditional initialization
- Move logic outside of effect where possible

## Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

## Author Notes:
Refactored components to derive state from props/searchParams instead of setting state in useEffect. Reduced unnecessary re-renders.

---

## Entry 6: TypeScript Lint Fixes
**File:** peerprep-frontend/src/context/AuthContext.tsx, peerprep-frontend/src/components/admin/QuestionsTab.tsx, peerprep-frontend/src/components/admin/UsersTab.tsx, peerprep-frontend/src/components/profile/EditProfileModal.tsx, peerprep-frontend/src/app/admin/page.tsx

## Date/Time:
2026-04-06 21:15

## Tool:
ChatGPT (GPT-5.3)

## Prompt/Command:
"Fix TypeScript lint error for Boolean vs boolean and avoid explicit any."

## Output Summary:
Recommended:
- Replace `Boolean` with `boolean`
- Define proper interfaces instead of `any`

## Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

## Author Notes:
Updated type definitions in API and components. Ensured type safety and removed lint warnings.

---

## Entry 7: Login Page Fix (URL Query + useEffect Issue)
**File:** peerprep-frontend/src/app/auth/login/page.tsx

## Date/Time:
2026-04-13 21:25

## Tool:
ChatGPT (GPT-5.3)

## Prompt/Command:
"Fix react-hooks/set-state-in-effect error in a Next.js login page where state is set based on URL query parameters. Also explain missing dependency warnings in useEffect."

## Output Summary:
Suggested:
- Avoid setting state inside useEffect for derived values
- Compute error message directly from URL query parameters instead of state
- Alternative patterns like derived variables or conditional rendering
- Fix dependency warnings by restructuring logic

## Action Taken:
- [ ] Accepted as-is
- [x] Modified
- [ ] Rejected

## Author Notes:
Refactored login page to derive error state from query parameters instead of using useEffect. Verified correctness via linting and testing.

---

## Entry 8: PeerPrep Logo (SVG/Icon)
**File:** peerprep-frontend/src/components/navbar/Navbar.tsx, peerprep-frontend/src/app/page.tsx

## Date/Time:
2026-04-13

## Tool:
Claude

## Prompt/Command:
"Generate a simple React SVG logo for a project called PeerPrep. The logo should be minimal, modern, and suitable for a coding/interview preparation platform. Output as a reusable React SVG component using currentColor for theme support."

## Output Summary:
Generated a React SVG logo component representing the PeerPrep brand. The design is minimal and scalable, suitable for use in a navbar or landing page header.

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated logo directly into frontend UI (header/navbar). Ensured consistent styling with application theme and verified rendering.

## Entry 9: Avatar Config Unit Tests
**File:** user-service/src/__tests__/config/avatar.test.ts

## Date/Time:
2026-04-05

## Tool:
Claude

## Prompt/Command:
Generated Jest unit tests for avatar utility functions (getDefaultAvatar and getRandomAvatar). Requested coverage for URL validation, bucket URL correctness, and ensuring generated avatar keys exist in predefined AVATAR_OPTIONS.

## Output Summary:
Generated unit tests covering:
- Default avatar URL generation
- Random avatar URL format validation
- Verification of correct GCS bucket URL usage
- Validation against known avatar option keys

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated generated test suite into avatar config tests to improve coverage and validate utility correctness.

---

## Entry 10: Auth Controller Unit Tests
**File:** user-service/src/__tests__/controllers/authController.test.ts

## Date/Time:
2026-04-05

## Tool:
Claude

## Prompt/Command:
Generate Jest unit tests for Express authentication controllers including registerUser, loginUser, verifyEmail, and resendVerification. Include mocking of AuthService methods and test both success and error cases such as successful registration, login returning JWT token, missing verification token, and resend verification email success response.

## Output Summary:
Generated Jest test suite for authentication controller functions. Tests included:
- User registration success and error handling via mocked AuthService
- Login flow returning JWT token and user data
- Email verification with missing token and valid token scenarios
- Resend verification email success response handling
- Mocking of AuthService methods using Jest

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated generated test cases into authentication controller test suite to improve coverage of API endpoints and service interactions. Verified correctness through Jest test execution.

---

## Entry 11: User Controller Unit Tests
**File:** user-service/src/__tests__/controllers/userController.test.ts

## Date/Time:
2026-04-05

## Tool:
Claude

## Prompt/Command:
Generate comprehensive Jest unit tests for Express user controller functions including getProfile, deleteUser, updateUserProfile, updatePassword, updateProfileIcon, getAvatarOptions, createAdmin, banUser, and getProfilesForService. Include mocking of UserService methods, validation error cases, and success responses. Ensure coverage includes invalid input handling, missing parameters, and successful service interactions.

## Output Summary:
Generated Jest test suite for multiple user controller endpoints. Coverage included:
- Profile retrieval and 404 handling
- User deletion success and not-found cases
- Profile update validation (email/password checks)
- Password update schema validation and success flow
- Profile icon update validation
- Avatar options retrieval with environment-based bucket URL
- Admin creation success flow
- User ban functionality
- Batch profile retrieval with missing/valid ID handling
- Mocking of UserService methods using Jest

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated generated tests into user controller test suite to improve backend API coverage. Verified correctness through Jest execution and ensured proper mocking of service layer dependencies.

---

---

## Entry 12: Error Handler Unit Tests (handleAppError)
**File:** user-service/src/__tests__/errors/handleAppError.test.ts

## Date/Time:
2026-04-05

## Tool:
Claude

## Prompt/Command:
Generate Jest unit tests for an Express error handling utility function handleAppError. Include test cases for AppError with specific error codes such as EMAIL_EXISTS, correct HTTP status and message handling, Zod validation errors returning 400 status, and unknown errors returning 500 with a fallback message. Ensure correct usage of Express Response mock methods (status and json) and validate HTTP responses for each case.

## Output Summary:
Generated Jest test suite for handleAppError covering multiple error scenarios:
- Custom AppError handling with specific error code (EMAIL_EXISTS), status, and message
- Zod validation error handling returning HTTP 400
- Generic unknown error handling returning HTTP 500 with fallback message
- Proper mocking of Express Response object methods

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated generated tests into error handling test suite. Verified correct HTTP response behavior across all error types using Jest.

---

## Entry 13: Authentication Middleware Unit Tests
**File:** user-service/src/__tests__/middleware/authMiddleware.test.ts

## Date/Time:
2026-04-05

## Tool:
Claude

## Prompt/Command:
Generate Jest unit tests for Express authentication middleware functions including authenticateToken and authenticateServiceToken. Include test cases for missing JWT token, invalid JWT token, valid token decoding, banned or deleted user checks, and service token validation. Mock jsonwebtoken, UserDB, and BanService dependencies. Ensure correct Express middleware behavior including calling next() and returning proper HTTP status codes.

## Output Summary:
Generated Jest test suite for authentication middleware covering:
- Missing authorization token returning 401
- Invalid JWT token returning 403
- Valid token decoding and attaching user to request object
- Handling of deleted user accounts with USER_DELETED error code
- Service token authentication success and failure cases
- Mocking of JWT verification, UserDB, and BanService methods

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated generated middleware tests into authentication test suite. Verified correct Express middleware behavior including authorization handling, token validation, and proper invocation of next().

---

## Entry 14: AuthService Unit Tests (Registration, Login, Verification, Resend)
**File:** user-service/src/__tests__/services/authServices.test.ts

## Date/Time:
2026-04-05

## Tool:
Claude

## Prompt/Command:
Generate comprehensive Jest unit tests for AuthService including register, login, verifyEmail, and resendVerification functions. Include mocking for UserDB, VerificationDB, bcrypt, and jsonwebtoken. Ensure coverage for error cases such as EMAIL_EXISTS, USERNAME_EXISTS, USER_NOT_FOUND, USER_BANNED, EMAIL_NOT_VERIFIED, INVALID_PASSWORD, INVALID_TOKEN, TOKEN_EXPIRED, and ALREADY_VERIFIED. Also include success flows for user registration, login with JWT generation, email verification, and resend verification email logic.

## Output Summary:
Generated Jest test suite for AuthService covering:
- User registration validation (email/username conflicts)
- Successful user creation with password hashing and verification token generation
- Login flow with multiple failure cases (not found, banned, unverified, invalid password)
- Successful login returning JWT token and user data
- Email verification with token validation, expiry handling, and user verification update
- Resend verification email logic with validation for unregistered or already verified users
- Mocking of UserDB, VerificationDB, bcrypt, and JWT dependencies

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated generated service-level tests into authentication test suite. Verified correctness of business logic flows including authentication, verification lifecycle, and error handling behavior.

---

## Entry 15: UserService Unit Tests (User Management)
**File:** user-service/src/__tests__/services/userServices.test.ts

## Date/Time:
2026-04-05

## Tool:
Claude

## Prompt/Command:
Generate comprehensive Jest unit tests for UserService including deleteUser, updatePassword, banUser, and createAdmin functions. Include mocking of UserDB and bcrypt dependencies. Ensure coverage for error cases such as SELF_DELETE, INCORRECT_PASSWORD, USER_DB_NOT_FOUND, CANNOT_BAN_ADMIN, and EMAIL_EXISTS. Also include success scenarios such as password hashing and update, user deletion, banning/unbanning users, and admin creation.

## Output Summary:
Generated Jest test suite for UserService covering:
- User deletion with self-deletion protection and valid deletion flow
- Password update with incorrect password handling and successful bcrypt hashing/update
- User banning logic with validation for self-ban, missing user, and admin restriction cases
- Admin creation with duplicate email/username validation and successful admin creation
- Mocking of UserDB and bcrypt dependencies for controlled test behavior

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated generated service-level tests into UserService test suite. Verified correct business logic enforcement including validation rules, password security handling, and user role constraints.

---

## Entry 16: Role-Based Authorization Middleware Unit Tests
**File:** user-service/src/__tests__/middleware/roleMiddleware.test.ts

## Date/Time:
2026-04-05

## Tool:
Claude

## Prompt/Command:
Generate Jest unit tests for Express role-based authorization middleware authorizeRoles. Include test cases for missing user role, unauthorized role access, authorized single role access, and multiple allowed roles. Ensure correct Express middleware behavior including returning HTTP 403 for unauthorized access and calling next() for valid roles.

## Output Summary:
Generated Jest test suite for authorizeRoles middleware covering:
- Missing user role resulting in 403 response
- User with invalid role being denied access (403)
- Valid role matching single allowed role passing through middleware
- Valid role matching one of multiple allowed roles passing through middleware
- Mocking Express Request, Response, and NextFunction behavior

## Action Taken:
- [x] Accepted as-is
- [ ] Modified
- [ ] Rejected

## Author Notes:
Integrated generated middleware tests into role-based authorization test suite. Verified correct access control behavior and middleware flow control using Jest.
