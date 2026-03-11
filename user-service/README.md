# PeerPrep - User Service 

src/
├── config/           # Database connection & pooling (PostgreSQL)
├── controllers/
│   ├── authController.ts # Business logic for Login & Registration
│   └── userController.ts # Logic for Profile, Updates, & Admin CRUD
├── services/
│   │   ├── authService.ts    # Business logic: hashing, JWTs, DB calls
│   │   └── userService.ts    # Business logic: user CRUD, DB calls
├── models/           # RAW SQL Queries only (The "Pantry")
│   └── userModel.ts
├── middleware/
│   ├── authMiddleware.ts # JWT verification & user attachment
│   └── roleMiddleware.ts # RBAC logic (authorizeRoles)
├── routes/
│   ├── authRoutes.ts     # Public Auth endpoints (/api/auth)
│   └── userRoutes.ts     # Protected User/Admin endpoints (/api/users)
├── types/            # TypeScript interfaces and type definitions
└── app.ts            # Main entry point; middleware & route mounting

## 🛠 Setup Instructions

1. **Database Setup**:
   - Open pgAdmin and create a database named `peerprep`.
   - Open the **Query Tool** and run the code found in `/database/init.sql`.

2. **Environment Variables**:
   - Create a `.env` file in this folder.
   - Generate JWT secrete key using node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   - Copy these values and update your DB password:
     ```env
     PORT=3004
     DB_USER=postgres
     DB_HOST=localhost
     DB_NAME=PeerPrep
     DB_PASS=YOUR_PASSWORD_HERE
     DB_PORT=5432
     JWT_SECRET=your_super_secret_key_here
     ```

3. **Install Dependencies**:
   ```bash
   npm install
   npm run dev