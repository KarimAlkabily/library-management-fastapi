# 📚 Library Management System

A full-stack Library Management System built with **FastAPI**, **PostgreSQL**, **Redis**, and **React**. The system supports book management, borrowing/returning, user authentication, role-based access control, caching, logging, and a monitoring dashboard.

---

## 🚀 Features

### Backend
- ✅ Full CRUD operations for books
- ✅ Borrow & return system with availability validation
- ✅ Prevent borrowing unavailable books
- ✅ Limit of 3 borrowed books per user
- ✅ Borrowing history tracking
- ✅ JWT authentication (register, login, token validation)
- ✅ Role-based access control (Admin / Member)
- ✅ Redis caching with Cache-Aside pattern
- ✅ Cache invalidation on create, update, delete
- ✅ Request logging with response time tracking
- ✅ Monitoring dashboard endpoint (`/monitoring`)
- ✅ Dockerized with docker-compose

### Frontend
- ✅ Login & Register pages
- ✅ Books list with search and pagination
- ✅ Admin: Add, Edit, Delete books
- ✅ Member: Borrow and Return books
- ✅ Borrowing history page
- ✅ Protected routes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, Python 3.11 |
| Database | PostgreSQL 15 |
| Caching | Redis 7 |
| Auth | JWT (python-jose) |
| ORM | SQLAlchemy |
| Frontend | React + Vite |
| Container | Docker + docker-compose |

---

## 📁 Project Structure

```
library-project/
├── backend/
│   ├── app/
│   │   ├── db_conn/
│   │   │   └── redis_db.py
│   │   ├── models/
│   │   │   ├── book.py
│   │   │   ├── user.py
│   │   │   └── borrow.py
│   │   ├── routes/
│   │   │   └── books.py
│   │   ├── schemas/
│   │   │   ├── book.py
│   │   │   └── user.py
│   │   ├── services/
│   │   │   └── book_service.py
│   │   ├── utils/
│   │   │   ├── jwt.py
│   │   │   ├── logger.py
│   │   │   └── security.py
│   │   ├── db.py
│   │   └── main.py
│   ├── tests/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── BooksList.jsx
    │   │   ├── BookCard.jsx
    │   │   ├── AddBook.jsx
    │   │   ├── History.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) v18+

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/library-project.git
cd library-project
```

---

### 2. Run the backend with Docker

Navigate to the backend folder:

```bash
cd backend
docker-compose up --build
```

This starts:
| Service | URL |
|---|---|
| FastAPI app | http://localhost:8001 |
| PostgreSQL | localhost:5433 |
| Redis | localhost:6379 |

> **Note:** If any port is already in use, run:
> ```bash
> sudo fuser -k 8001/tcp 5433/tcp 6379/tcp
> docker-compose up
> ```

---

### 3. Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at **http://localhost:5173**

---

### 4. Create an admin user

Register through the UI or API, then promote the user to admin via the database:

```bash
docker exec -it library_db psql -U postgres -d library_db \
  -c "UPDATE users SET role='admin' WHERE email='your@email.com';"
```

Then logout and login again.

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login and get JWT token | Public |

### Books
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/books` | Get all books | Public |
| GET | `/books/{id}` | Get book by ID | Public |
| POST | `/books` | Create a book | Admin |
| PUT | `/books/{id}` | Update a book | Admin |
| DELETE | `/books/{id}` | Delete a book | Admin |

### Borrow
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/borrow?book_id={id}` | Borrow a book | Member |
| POST | `/borrow/return?book_id={id}` | Return a book | Member |
| GET | `/history` | View borrowing history | Member |

### Monitoring
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/monitoring` | Monitoring dashboard (request count, avg response time, error count) |

---

## 🔐 Roles & Permissions

| Action | Admin | Member |
|---|---|---|
| View books | ✅ | ✅ |
| Add / Edit / Delete books | ✅ | ❌ |
| Borrow a book | ❌ | ✅ |
| Return a book | ❌ | ✅ |
| View own history | ✅ | ✅ |

---

## ⚡ Caching Strategy (Redis)

The system uses the **Cache-Aside pattern**:

- `GET /books` → cached for 60 seconds under key `books`
- `GET /books/{id}` → cached for 60 seconds under key `book:{id}`
- Cache is **invalidated** automatically on any create, update, or delete operation

---

## 📊 Monitoring

Access the monitoring dashboard at:

```
GET http://localhost:8001/monitoring
```

Response:
```json
{
  "api_request_count": 42,
  "avg_response_time_ms": 18.5,
  "error_count": 2,
  "system_health_status": "ok"
}
```

---

## 🧪 Running Tests

```bash
cd backend
pytest tests/
```

## 📄 License

This project was developed as part of a backend development course using FastAPI.
