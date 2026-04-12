[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/HpD0QZBI)
# CS3219 Project (PeerPrep) - AY2526S2
## Group: G10

### Note: 
- You are required to develop individual microservices within separate folders within this repository.
- The teaching team should be given access to the repositories, as we may require viewing the history of the repository in case of any disputes or disagreements. 

### Set Up Instructions

#### Prerequisites
- NodeJS >= v20.9 (recommend using `nvm use 22`)
- Docker Desktop installed and running

#### 1. Database, User Service and Matching Set Up
From the project root:
```bash
docker compose up -d --build
```

> ⚠️ Note: Please update your .env file in question-service, user-service, matching-service and collaboration-service before building and starting up the containers with this command.
>
> The following environment variables must be set consistently across **all four services** (same values):
> - `JWT_SECRET` — shared secret for JWT verification
> - `AUTH_REDIS_URL` — overridden automatically by docker-compose to `redis://auth-redis:6379`; set to `redis://localhost:6380` for local development

This starts databases container, question-service container, user-service container and matching-service container:
- **question-db** on port `5433`
- **user-db** on port `5434` — automatically runs `init.sql` (creates the users table)
- **matching-redis** on port `6379` — queue management for the matching service
- **auth-redis** on port `6380` — ban blacklist and Pub/Sub events for real-time user banning
- **question-service** on port `3003`
- **user-service** on port `3004`
- **matching-service** on port `3002`
- **collaboration-service** on port `3001`

**Default admin account** — run after the database is up:
```bash
cd user-service && npm run seed
```
Credentials are set via `ADMIN_SEED_PASSWORD` / `ADMIN_SEED_EMAIL` / `ADMIN_SEED_USERNAME` in `user-service/.env`.

> To reset the databases from scratch, run `docker compose down -v && docker compose up -d`.

#### 2. Question Service Set Up

#### 2.1 Option 1: Question Service Set Up (Local)
```bash
cd question-service
npm install
cp .env.example .env
npm run dev        # starts on port 3003, creates tables automatically
npm run seed       # populates the database with sample questions
```
Verify: `curl localhost:3003/questions/topics`

#### 2.2 Option 2: Question Service Set Up (Docker)
```bash
cd question-service
cp .env.example .env
cd ..
docker compose up --build question-service
```

For dockerized question-service, `docker-compose.yml` overrides network-dependent values (for example `DATABASE_URL`) so container-to-container communication works correctly.

#### 3. User Service Set Up

#### 3.1 Option 1: User Service Set Up (Local)
```bash
cd user-service
npm install
cp .env.example .env
npm run dev        # starts on port 3004
```

#### 3.2 Option 2: User Service Set Up (Docker)
```bash
cd user-service
cp .env.example .env
cd ..
docker compose up --build user-service
```

For dockerized user-service, `docker-compose.yml` overrides network-dependent values so container-to-container communication works correctly.

#### 4. Matching Service Set Up

#### 4.1 Option 1: Matching Service Set Up (Local)
```bash
cd matching-service
npm install
cp .env.example .env
npm run dev        # starts on port 3002
```

#### 4.2 Option 2: Matching Service Set Up (Docker)
```bash
cd matching-service
cp .env.example .env
cd ..
docker compose up --build redis matching-service
```

For dockerized matching-service, `docker-compose.yml` overrides network-dependent values (for example `REDIS_URL=redis://matching-redis:6379`) so container-to-container communication works correctly.

#### 5. Collaboration Service Set Up

#### 5.1 Option 1: Collaboration Service Set Up (Local)
```bash
cd collaboration-service
npm install
cp .env.example .env
npm run dev        # starts on port 3001
```

#### 5.2 Option 2: Collaboration Service Set Up (Docker)
```bash
cd collaboration-service
cp .env.example .env
cd ..
docker compose up --build collaboration-service
```

For dockerized collaboration-service, `docker-compose.yml` overrides network-dependent values so container-to-container communication works correctly.

#### 5.3 Create Collaboration Service room manually
If Collaboration Service is run independently, you may need to request a collaboration service room manually. The question service needs to be run for collaboration service to create a room as the collaboration service needs to retrieve a question in the room creation process. Afterwards you can create a room by running the following commands:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3001/rooms" -ContentType "application/json" -Body (@{questionId=351;user1Id="user1";user2Id="user2"} | ConvertTo-Json)
```

or 

```powershell
 curl.exe -X POST "http://localhost:3001/rooms" -H "Content-Type: application/json" --data-raw '{\"questionId\":351,\"user1Id\":\"user1\",\"user2Id\":\"user2\"}'
```

These commands should provide you with the roomId as part of the response. After running the frontend you can use the roomId to access the room at http://localhost:3000/collaboration/[roomId]?user=user1

and 

http://localhost:3000/collaboration/[roomId]?user=user2

#### 5.4 NGINX reverse proxy set up for cross machine voice call functionality
To enable voice call functionality the following set up steps needs to be completed:

Linux and MacOS:

```bash or Z-shell
mkcert -install
mkdir -p nginx/certs
mkcert -cert-file nginx/certs/cert.pem -key-file nginx/certs/key.pem localhost 127.0.0.1 ::1 <your_lan_ip>
docker compose up -d --build
```

Windows:

```powershell
mkcert -install
mkdir nginx\certs
mkcert -cert-file nginx\certs\cert.pem -key-file nginx\certs\key.pem localhost 127.0.0.1 ::1 <their_lan_ip>
docker compose up -d --build
```

Do note keytool error while running mkcert -install can be safely ignored

#### 6. Frontend Set Up
```bash
cd peerprep-frontend
npm install
npm run dev        # starts on port 3000
```

### Running the App

#### Option 1: All services via Docker (recommended)
1. Start all services: `docker compose up -d --build`
2. Open https://localhost

#### Option 2: Services locally
1. Start databases: `docker compose up -d question-db user-db collaboration-db redis auth-redis`
2. Start question-service: `cd question-service && npm run dev`
3. Start user-service: `cd user-service && npm run dev`
4. Start matching-service: `cd matching-service && npm run dev`
5. Start collaboration-service: `cd collaboration-service && npm run dev`
6. Start frontend: `cd peerprep-frontend && npm run dev`
7. Open http://localhost:3000

### Available Pages
| Route | Description |
|-------|-------------|
| `/auth/login` | Login page |
| `/auth/register` | User registration |
| `/auth/check-email` | Check email |
| `/auth/verify-email` | Verify email |
| `/user` | User dashboard (requires user role) |
| `/user/profile` | User profile |
| `/user/attempts/[id]` | User attempt details |
| `/admin` | Admin dashboard — question management with search, pagination, create/edit/delete (requires admin role) |
| `/admin/profile` | Admin profile |
| `/admin/create-admin` | Create a new admin |
| `/admin/questions/create` | Create a new question |
| `/admin/questions/[id]/edit` | Edit an existing question |
| `/collaboration/[roomId]?user=[userId]` | Access the collaboration page |

### Running Test

#### 1. Matching Service Test Run

> Note: You may need to run `npm install` for the first time if test packages are not yet installed

#### Running Unit and Integration Test

```bash
cd matching-service
npm run test
```

#### Running Integration Test Only

```bash
cd matching-service
npm run test:integration
```