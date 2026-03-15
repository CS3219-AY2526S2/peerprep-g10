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

#### 1. Database Set Up
From the project root:
```bash
docker compose up -d
```
This starts two PostgreSQL containers and one Redis container:
- **question-db** on port `5433`
- **user-db** on port `5434` — automatically runs `init.sql` (creates the users table) and `seed.sql` (seeds a default admin account)
- **redis** on port `6379`

**Default admin account** (seeded automatically):
- Email: `admin@peerprep.com`
- Password: `Admin123!`

> To reset the databases from scratch, run `docker compose down -v && docker compose up -d`.

#### 2. Question Service Set Up
```bash
cd question-service
npm install
cp .env.example .env
npm run dev        # starts on port 3003, creates tables automatically
npm run seed       # populates the database with sample questions
```
Verify: `curl localhost:3003/questions/topics`

#### 3. User Service Set Up
```bash
cd user-service
npm install
cp .env.example .env
npm run dev        # starts on port 3004
```

#### 4. Matching Service Set Up
```bash
cd matching-service
npm install
cp .env.example .env
npm run dev        # starts on port 3002
```

#### 5. Frontend Set Up
```bash
cd peerprep-frontend
npm install
npm run dev        # starts on port 3000
```

### Running the App
1. Start databases: `docker compose up -d`
2. Start question-service: `cd question-service && npm run dev`
3. Start user-service: `cd user-service && npm run dev`
4. Start matching-service: `cd matching-service && npm run dev`
5. Start frontend: `cd peerprep-frontend && npm run dev`
6. Open http://localhost:3000

### Available Pages
| Route | Description |
|-------|-------------|
| `/auth/login` | Login page |
| `/auth/register` | User registration |
| `/user` | User dashboard (requires user role) |
| `/user/profile` | User profile (requires user role) |
| `/admin` | Admin dashboard — question management with search, pagination, create/edit/delete (requires admin role) |
| `/admin/questions/create` | Create a new question |
| `/admin/questions/[id]/edit` | Edit an existing question |