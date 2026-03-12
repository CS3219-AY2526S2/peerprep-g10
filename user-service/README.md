# PeerPrep - User Service

```
src/
├── config/                   # Database connection & pooling (PostgreSQL)
├── controllers/
│   ├── authController.ts     # Business logic for Login & Registration
│   └── userController.ts     # Logic for Profile, Updates, & Admin CRUD
├── services/
│   ├── authService.ts        # Business logic: hashing, JWTs, DB calls
│   └── userService.ts        # Business logic: user CRUD, DB calls
├── models/                   # Raw SQL Queries only (The "Pantry")
│   └── userModel.ts
├── middleware/
│   ├── authMiddleware.ts     # JWT verification & user attachment
│   └── roleMiddleware.ts     # RBAC logic (authorizeRoles)
├── routes/
│   ├── authRoutes.ts         # Public Auth endpoints (/api/auth)
│   └── userRoutes.ts         # Protected User/Admin endpoints (/api/users)
├── database/
│   ├── init.sql              # Schema definition; creates tables & constraints
│   └── seed.sql              # Initial data; default users & test records
├── app.ts                    # Express app setup; middleware & route mounting
└── server.ts                 # Entry point; starts HTTP server & DB connection
```
