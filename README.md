# nextjs-auth

A simple Next.js authentication example using MongoDB, Mongoose, JWT, and bcrypt. This project is built with the Next.js App Router and provides server API routes for user signup and login. Client pages for signup, login and a protected profile route are included for demonstration.

## Key folders / files

- `src/app` — Next.js app pages and client components (including `/signup`, `/login`, `/profile`).
- `src/app/api/users/signup/route.ts` — API route that creates a new user.
- `src/app/api/users/login/route.ts` — API route that authenticates a user and returns a JWT.
- `src/dbConfig/dbConfig.ts` — connects to MongoDB with Mongoose.
- `src/models/userModel.js` — Mongoose `User` schema and model.

## Tech stack

- Next.js (App Router)
- React
- TypeScript (project-level)
- MongoDB + Mongoose
- bcryptjs for password hashing
- jsonwebtoken for issuing JWTs
- axios for client HTTP calls
- react-hot-toast for client notifications

## Features

- Signup with hashed password (bcrypt)
- Login with JWT token (expires in 1 hour)
- Simple client pages for signup and login that call the API routes

## Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or cloud; MongoDB Atlas is recommended)

## Environment variables

Create a `.env.local` file in the project root (Next.js will pick this up) and set:

```
MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret_string
```

- `MONGO_URI` — MongoDB connection string used by `src/dbConfig/dbConfig.ts`.
- `TOKEN_SECRET` — secret used to sign JWT tokens in `src/app/api/users/login/route.ts`.

Note: The code includes `nodemailer` in `package.json` but there is no mail-sending implementation in these routes. If you add email verification or password reset flows you can configure SMTP settings as needed.

## Install

Open a terminal in the project root and run:

```powershell
# install dependencies
npm install
```

## Run (development)

```powershell
# start Next.js dev server
npm run dev
```

The app will be available at http://localhost:3000 by default.

## Available scripts (from `package.json`)

- `npm run dev` — runs the Next.js dev server
- `npm run build` — builds the app for production
- `npm run start` — runs the built app
- `npm run lint` — runs ESLint

## API Endpoints

All API routes live under `/api/users`.

### POST /api/users/signup

Create a new user.

Request body (JSON):

```json
{
	"username": "yourUsername",
	"email": "you@example.com",
	"password": "yourPassword"
}
```

Success response (201):

```json
{
	"message": "User created successfully",
	"success": true,
	"savedUser": { /* saved user document (password hashed) */ }
}
```

Error responses:

- 400 — user already exists
- 500 — internal server error

Implementation notes: the route calls `connect()` from `src/dbConfig/dbConfig.ts` which uses `process.env.MONGO_URI` and saves the user with a hashed password using `bcryptjs`.

### POST /api/users/login

Authenticate a user and receive a JWT.

Request body (JSON):

```json
{
	"email": "you@example.com",
	"password": "yourPassword"
}
```

Success response (200):

```json
{
	"message": "Login successful",
	"token": "<jwt-token>",
	"user": { /* user object */ }
}
```

Error responses:

- 404 — user not found
- 401 — invalid credentials
- 500 — internal server error

Implementation notes: password is compared with `bcrypt.compare` and a JWT is signed with `process.env.TOKEN_SECRET` and expires in 1 hour.

## Client usage (example)

The React client pages use `axios` to call the API routes. Example (same approach used in `src/app/signup/page.tsx` and `src/app/login/page.tsx`):

```js
// signup example (client)
import axios from 'axios';

await axios.post('/api/users/signup', {
	username: 'myuser',
	email: 'me@example.com',
	password: 'secret123'
});

// login example (client)
const res = await axios.post('/api/users/login', {
	email: 'me@example.com',
	password: 'secret123'
});
// res.data.token contains the JWT
```

If you want to call the endpoints from an external client (Postman / curl), use the full URL `http://localhost:3000/api/users/login` and send JSON body.

## Data model

The `User` schema is defined in `src/models/userModel.js` and contains the following fields:

- `username` (String, unique, required)
- `email` (String, unique, required)
- `password` (String, required — stored hashed)
- `isVerified` (Boolean)
- `isAdmin` (Boolean)
- `forgotPasswordToken` (String)
- `forgotPasswordTokenExpiry` (Date)
- `verifyTokenExpiry` (Date)

The model is exported as the `users` collection.

## How it works (high level)

1. Server-side API routes call `connect()` from `src/dbConfig/dbConfig.ts` to ensure Mongoose is connected.
2. On signup, incoming password is hashed using `bcryptjs` and saved to MongoDB.
3. On login, the password is compared and a JWT is issued using `jsonwebtoken`.

## Troubleshooting

- "MongoDB connected successfully." should appear in the server console if `MONGO_URI` is correct.
- If you see connection errors, double-check `MONGO_URI` and network access (for Atlas ensure IP whitelist or use a connection string with access enabled).
- If JWT signing fails, confirm `TOKEN_SECRET` is set.

## Next steps / improvements

- Add protected API routes that verify the JWT from Authorization header.
- Implement email verification and password reset using `nodemailer` (SMTP config needed).
- Add better validation and rate-limiting to the auth routes.

## License

This repo does not include a license file. Add one if you plan to publish or share the code publicly.

