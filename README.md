# TaskManager 🗂️

A secure, full-stack task management app with JWT authentication and role-based access control.

---
## Project Structure

```
Task-Manager/
├── backend/
│   ├── src/
│   │   ├── controllers/   # auth, task, admin
│   │   ├── middleware/    # auth, error
│   │   ├── models/        # User, Task
│   │   ├── routes/        # auth, task, admin
│   │   ├── utils/         # asyncHandler, generateToken, validateRequest
│   │   └── validations/   # auth, task
│   └── swagger.js
└── frontend/
    └── src/
        ├── components/    # Navbar, TaskCard, TaskModal, TaskDetailModal, ProtectedRoute
        ├── context/       # AuthContext
        ├── pages/         # Login, Register, Dashboard, AdminDashboard
        └── services/      # api.js
```
---

## Tech Stack

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Frontend**

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Deployment**

![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## Features

**Auth**
- Register and login with hashed passwords (bcryptjs)
- JWT stored in httpOnly cookies — XSS safe
- Persistent sessions via `/auth/me` on page load

**Role-Based Access**
- `user` — manage only their own tasks
- `admin` — manage all tasks and view all users
- Admin accounts created manually via DB — no self-promotion

**Tasks**
- Full CRUD — create, view, edit, delete, toggle status
- Search by title with debounce
- Pagination (6 tasks per page)
- Click any task card to view full detail in modal

**Security**
- NoSQL injection prevention
- Input validation on every route (express-validator)
- Role check on every protected route

---

## API Reference

### Auth — `/api/v1/auth`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login and set cookie |
| POST | `/logout` | Private | Clear cookie |
| GET | `/me` | Private | Get current user |

### Tasks — `/api/v1/tasks`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/` | Private | Create task |
| GET | `/` | Private | Get own tasks (search + pagination) |
| GET | `/:id` | Private | Get single task |
| PUT | `/:id` | Private | Update task (owner or admin) |
| DELETE | `/:id` | Private | Delete task (owner or admin) |

### Admin — `/api/v1/admin`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/tasks` | Admin | Get all tasks from all users |
| GET | `/users` | Admin | Get all registered users |

> Full interactive docs available at `/api-docs` (Swagger UI)

---

## Local Setup

**Backend**
```bash
cd backend
npm install
# create .env from .env.example and fill values
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Environment Variables**
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## Scalability Notes

- **API versioning** via `/api/v1` — new versions can be added without breaking existing clients
- **Modular architecture** — auth, tasks, and admin are fully separated modules
- **Stateless JWT auth** — horizontally scalable, no server-side sessions
- **MongoDB indexing** on `createdBy` field for faster user-specific queries
- **Admin routes isolated** — easy to extract into a separate microservice
- **Docker-ready** structure — can be containerized with minimal changes
- **Redis** can be added for caching frequent admin queries

---

Built by Me ([Nitai Dalal](https://github.com/nitai)) as an internship assignment for Primetrade.ai