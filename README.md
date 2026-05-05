# Team Task Manager

Simple MERN app for managing projects, team members, and tasks with role-based access.

## Features

- Signup and login with JWT authentication
- Admin and Member roles
- Project creation with team member assignment
- Task creation, assignment, and status updates
- Dashboard with task counts and overdue tasks
- REST API backed by MongoDB

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

Set these environment variables in `backend/.env`:

- `MONGO_URI` or `MONGO_ATLAS_URI`
- `JWT_SECRET`
- `PORT`
- `CLIENT_URL`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

If needed, set `VITE_API_URL` in `frontend/.env` to point to the backend API.

## Roles

- Admin: create projects, create tasks, and assign team members
- Member: view assigned tasks and update task status

## API Summary

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id/status`
- `GET /api/users` for admin-only member selection in forms

## Demo Account

Run `backend/scripts/createAdmin.js` once to create the seeded admin account:

- Email: `admin@gmail.com`
- Password: `admin`

## What To Mention In A Demo Video

1. Sign up as a member and log in.
2. Show the admin flow for creating a project and adding members.
3. Create a task, assign it to a project member, and set a due date.
4. Open the dashboard and point out task counts and overdue tasks.
5. Log in as a member and update the status of an assigned task.
