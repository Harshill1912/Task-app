# Task Tracker Backend

Simple Node.js, Express, TypeScript, MongoDB, and Mongoose API for a Task Tracker app.

## Environment

Create `.env` from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-tracker
JWT_SECRET=replace-this-with-a-long-random-secret
```

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `.env` with your MongoDB connection string and JWT secret before running in a real environment.

The API runs on `http://localhost:5000` by default.

## Scripts

- `npm run dev` - start the development server with auto-reload
- `npm run build` - compile TypeScript into `dist/`
- `npm start` - run the compiled app

## API

### Auth

`POST /auth/signup`

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123"
}
```

`POST /auth/login`

```json
{
  "email": "ada@example.com",
  "password": "password123"
}
```

Both auth endpoints return a JWT token. Send it with task requests:

```http
Authorization: Bearer <token>
```

### Tasks

`GET /tasks` - list logged-in user's tasks

`POST /tasks`

```json
{
  "title": "Plan sprint",
  "description": "Write down the first set of tickets"
}
```

`PATCH /tasks/:id`

```json
{
  "title": "Plan sprint",
  "description": "Finalize ticket list",
  "completed": true
}
```

`DELETE /tasks/:id` - delete a logged-in user's task

`POST /tasks/upload` - upload one authenticated task attachment using multipart form field `file`

Upload limit: 5 MB.

## Security Notes

- Passwords are hashed with bcryptjs before storage.
- Task routes require `Authorization: Bearer <token>`.
- Do not commit `.env` with real credentials.

## Mobile Client

The Expo app lives in `../mobile`. Set `EXPO_PUBLIC_API_URL` in `mobile/.env` to the backend URL.

## Demo Video

Demo video placeholder: add a walkthrough link here before submission.
