[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/HpD0QZBI)
# CS3219 Project (PeerPrep) - AY2526S2
## Group: G10

### Note: 
- You are required to develop individual microservices within separate folders within this repository.
- The teaching team should be given access to the repositories, as we may require viewing the history of the repository in case of any disputes or disagreements. 

### Set Up Instructions:
- Ensure NodeJS is installed (Min Version v20.9)

#### Frontend Set Up:
1. `cd peerprep-frontend`
2. Install packages with `npm install`
3. Create file `.env` in `peerprep-frontend` root directory
4. Run app with `npm run dev`

#### Database Set Up:
1. Ensure Docker Desktop is installed and running
2. From the project root, run `docker compose up -d` to start the PostgreSQL container

#### Backend Set Up:
1. `cd XXX-service`
2. Install packages with `npm install`
3. Copy `.env.example` to `.env` and fill in any missing values
4. Run app with `npm run dev`

#### Question Service Set Up:
1. Ensure the PostgreSQL container is running (see Database Set Up)
2. `cd question-service`
3. Install packages with `npm install`
4. Copy `.env.example` to `.env`
5. Run `npm run dev` (creates the database tables automatically)
6. Run `npm run seed` to populate the database with questions
7. Verify with `curl localhost:3003/questions/topics`