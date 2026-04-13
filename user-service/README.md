# 👤 PeerPrep — User Service

Handles user registration, authentication, profile management, and admin operations for PeerPrep platform.

---

## 📁 Project Structure

```
src/
├── config/
│   ├── db.ts                 # PostgreSQL connection pool
│   ├── authRedis.ts          # auth-redis clients — ban blacklist (SADD/SREM/SISMEMBER) + Pub/Sub publish
│   ├── avatar.ts             # Avatar helpers (default & random picker)
│   └── avatars.json          # Avatar keys (single source of truth)
├── controllers/
│   ├── authController.ts     # Register, login, email verification
│   ├── userController.ts     # Profile, updates, admin CRUD
│   └── banController.ts      # Service-to-service ban status check
├── services/
│   ├── authServices.ts       # Auth logic: hashing, JWTs, tokens
│   ├── userServices.ts       # User logic: CRUD, password, banning
│   └── banService.ts         # Redis ban blacklist — isBanned / banUser / unbanUser
├── models/
│   ├── userModel.ts          # Raw SQL queries for users table
│   └── verificationModel.ts  # Raw SQL queries for email_verifications table
├── middleware/
│   ├── authMiddleware.ts     # JWT verification, ban check, service token auth
│   └── roleMiddleware.ts     # RBAC — authorizeRoles()
├── routes/
│   ├── authRoutes.ts         # Public auth endpoints (/api/auth)
│   ├── userRoutes.ts         # Protected user/admin endpoints (/api/users)
│   └── banRoutes.ts          # Service-to-service ban check (/api/ban)
├── errors/
│   ├── AppError.ts           # Custom error class & error registry
│   └── handleAppError.ts     # Centralised error handler for controllers
├── validator/
│   └── userSchema.ts         # Zod schemas: register, updateProfile, changePassword
├── database/
│   ├── init.sql              # Table definitions, constraints & triggers
│   └── seed.sql              # Default admin account seed
├── app.ts                    # Express app — middleware & route mounting
└── server.ts                 # Entry point — starts HTTP server, DB & Redis connections
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the service:

```env
# Server
PORT=3004

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/peerprep

# Auth
JWT_SECRET=your_jwt_secret_here
SERVICE_SECRET_KEY=your_service_secret_here

# Redis (ban blacklist + Pub/Sub)
AUTH_REDIS_URL=redis://localhost:6380

# Email (Resend)
RESEND_API_KEY=your_resend_api_key_here
FRONTEND_URL=http://localhost:3000

# Storage (Google Cloud Storage)
GCS_BUCKET_URL=https://storage.googleapis.com/your-bucket/avatars
```

---

## 🚀 Getting Started

### Prerequisites

| | Local | Docker |
|---|---|---|
| Node.js >= 18 | ✅ | — |
| PostgreSQL >= 14 | ✅ | — |
| Docker & Docker Compose | — | ✅ |

### Environment Setup

Both options require a `.env` file first:

```bash
cd user-service
cp .env.example .env
# Fill in your values in .env
```

---

### Option 1: Local

```bash
cd user-service
npm install
cp .env.example .env
# Set ADMIN_SEED_PASSWORD (and optionally ADMIN_SEED_EMAIL / ADMIN_SEED_USERNAME) in .env
npm run dev        # starts on port 3004
npm run seed       # creates the initial admin account — safe to run multiple times
```

---

### Option 2: Docker

```bash
cd user-service
cp .env.example .env
cd ..
docker compose up --build user-service
```

The service will be available at `http://localhost:3004`.

> The Docker image uses a **multi-stage build** (Node 24 Alpine). Stage 1 compiles TypeScript; Stage 2 runs the production build with dev dependencies stripped.

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login and receive a JWT |
| `GET` | `/verify-token` | JWT | Validate JWT and return user |
| `GET` | `/verify-email?token=` | Public | Verify email from token link |
| `POST` | `/resend-verification` | Public | Resend verification email (rate limited: 3/15min) |

### Users — `/api/users`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/avatars` | Public | — | List all available avatar options |
| `POST` | `/services/profiles` | Service Key | — | Fetch multiple user profiles (service-to-service) |
| `GET` | `/me` | JWT | User | Get own profile |
| `PATCH` | `/me/icon` | JWT | User | Update profile icon |
| `PATCH` | `/update-profile` | JWT | User | Update username and/or email |
| `PATCH` | `/change-password` | JWT | User | Change password |
| `GET` | `/all-users` | JWT | Admin | List all users |
| `DELETE` | `/:id` | JWT | Admin | Delete a user |
| `PATCH` | `/:id/ban` | JWT | Admin | Ban or unban a user — also writes to Redis ban blacklist and publishes a Pub/Sub event |
| `POST` | `/create-admin` | JWT | Admin | Create a new admin account |

### Ban (service-to-service) — `/api/ban`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/check?userId=<id>` | Service Key | Returns `{ banned: boolean }` — used by other services as a fallback ban check |

---

## 🔐 Authentication

- **User JWT** — Issued on login, valid for **6 hours**. Attach as `Authorization: Bearer <token>`.
- **Service Key** — Static secret for service-to-service calls. Set via `SERVICE_SECRET_KEY` env var.
- **Email Verification Tokens** — Single-use, expire in **15 minutes**. Covers both registration and email change flows.

### Ban Blacklist

When `PATCH /:id/ban` is called with `is_banned: true`, the service:
1. Updates the `is_banned` column in PostgreSQL.
2. Adds the userId to the `auth:banned` Redis SET (on `auth-redis`, port 6380).
3. Publishes `{ action: "ban", userId }` to the `auth:ban:events` Pub/Sub channel.

All other services subscribe to this channel and immediately disconnect the banned user's open sockets. Every authenticated HTTP request across all services also checks this Redis SET, returning `403 { code: "USER_BANNED" }` if the user is present.

---

## 🛡️ Error Handling

All errors are handled centrally via `handleAppError`. The service uses a typed `AppError` registry (`src/errors/AppError.ts`) for consistent HTTP status codes and messages across the codebase.

Key error codes:

| Code | Status | Description |
|------|--------|-------------|
| `EMAIL_EXISTS` | 400 | Email already registered |
| `USERNAME_EXISTS` | 400 | Username already taken |
| `USER_NOT_FOUND` | 401 | Email not registered |
| `INVALID_PASSWORD` | 401 | Wrong password |
| `EMAIL_NOT_VERIFIED` | 403 | Account not yet verified |
| `USER_BANNED` | 403 | Account is banned |
| `INVALID_TOKEN` | 400 | Bad verification link |
| `TOKEN_EXPIRED` | 400 | Verification link expired |
| `LAST_ADMIN` | 400 | Cannot delete the last admin |
| `CANNOT_BAN_ADMIN` | 403 | Admins cannot be banned |
| `SELF_DELETE` | 400 | Cannot perform action on own account |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

Tests are written with **Jest** and **ts-jest**. Mocks are used for `pool` (PostgreSQL), `bcrypt`, `jsonwebtoken`, and `resend`.

### Test Structure

```
src/
└── __tests__/
    ├── config/
    │   └── avatar.test.ts
    ├── errors/
    │   └── handleAppError.test.ts
    ├── middleware/
    │   ├── authMiddleware.test.ts
    │   └── roleMiddleware.test.ts
    ├── services/
    │   ├── authServices.test.ts
    │   └── userServices.test.ts
    └── controllers/
        ├── authController.test.ts
        └── userController.test.ts
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server framework |
| `pg` | PostgreSQL client |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT signing & verification |
| `zod` | Input validation schemas |
| `resend` | Transactional email |
| `express-rate-limit` | Rate limiting |
| `dotenv` | Environment variable loading |
| `validator` | RFC5322 email validation |
