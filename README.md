# Task Manager — Setup & Usage

This repository contains a simple task & project management app with a Node/Express backend and a React frontend.

## Prerequisites
- Node.js (v16+ recommended)
- npm or Yarn
- MongoDB (local or Atlas)

## Environment
Backend env file: `backend/.env` (already present).

Important environment variables (add or edit in `backend/.env`):

- `MONGO_URI` — local MongoDB (existing example: `mongodb://localhost:27017/team-task-manager`).
- `MONGOSH_URI` — alternate local connection (e.g. `mongodb://127.0.0.1:27017`).
- `MONGO_ATLAS_URI` — Atlas connection string.
- `JWT_SECRET` — JSON Web Token secret for auth.
- `PORT` — backend server port (default `5000`).
- `CLIENT_URL` — frontend URL for CORS (default `http://localhost:5173`).

Example Atlas URI (already added to `backend/.env`):

`mongodb+srv://StudyPoint:Cb3oog9A97jZO6cH@cluster0.whyvvvy.mongodb.net/task_manager?retryWrites=true&w=majority&appName=Cluster0`

> Note: Keep credentials private — do not commit real secrets to public repos.

## Install & Run

1) Backend

```bash
cd backend
npm install
# start in development (if package.json has nodemon):
npm run dev
# or:
npm start
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
# open the dev URL (usually http://localhost:5173)
```

If ports conflict, update `PORT` in `backend/.env` or the Vite dev server port in `frontend/package.json` / `vite.config.js`.

## How the app works (features)

- User authentication: Signup and Login endpoints + JWT-based protected routes.
- Role-based access: `roleMiddleware` controls admin/user routes.
- Projects: create, list, view project details, and track progress.
- Tasks: create tasks, assign to users, update status.
- Users: admin can view/manage users (see `userController`).

Frontend pages (in `frontend/src/pages`):
- `Signup`, `Login` — auth flows
- `Dashboard`, `Projects`, `ProjectDetails`, `CreateProject`, `CreateTask`, `MyTasks`, `Users`

## API (quick reference)
Backend routes are in `backend/routes`.

- `POST /api/auth/signup` — create user
- `POST /api/auth/login` — login
- `GET /api/projects` — list projects (protected)
- `POST /api/projects` — create project (protected)
- `GET /api/projects/:id` — project details
- `GET /api/tasks` — list tasks (protected)
- `POST /api/tasks` — create task (protected)
- `GET /api/users` — list users (admin only)

Check the controllers in `backend/controllers` for full behavior.

## Using Atlas vs Local MongoDB

The backend reads `MONGO_ATLAS_URI` and `MONGO_URI` from `backend/.env` (see `backend/config/db.js`). To prefer Atlas, set `MONGO_ATLAS_URI` with a valid connection string. If you want to use a specific variable in code, update `config/db.js` to prefer `MONGO_ATLAS_URI` when present.

## Troubleshooting

- DB connection errors: verify the URI string and network access (Atlas IP whitelist). Use the `mongosh` CLI to test connectivity.
- Auth issues: confirm `JWT_SECRET` is present and unchanged between sign-in and token verification.
- CORS errors: ensure `CLIENT_URL` matches your frontend dev URL.

## Next steps you might want me to do
- Update `backend/config/db.js` to prefer `MONGO_ATLAS_URI` when available.
- Add `README` sections for API examples and sample requests.

---
Files you may want to check:
- [backend/.env](backend/.env#L1)
- [backend/config/db.js](backend/config/db.js#L1)

