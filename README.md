# IndoKerja.id — Job Application Management Platform

A full-stack job application management platform connecting **Job Seekers** and **Companies** in Indonesia. Built with React, Express, Prisma, and PostgreSQL.

## Features

### Job Seeker
- Browse and search available job listings
- View detailed job information (description, requirements, salary range)
- Apply to jobs with one click
- Track all submitted applications and their current status
- View full application history timeline
- Manage personal profile

### Company
- Dashboard with hiring activity overview (total jobs, applications, status breakdown)
- Create and manage job listings
- View and filter applicants for each job
- Update application status with enforced workflow transitions
- View applicant profile and application timeline
- Post new job openings (Full-time, Part-time, Contract, Internship)

### Application Status Workflow

```
Applied → Reviewing → Shortlisted → Accepted
                ↓            ↓
             Rejected     Rejected
```

Every status change is recorded in Application History for full audit trail.

## Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS v4 |
| Backend    | Node.js, Express.js, TypeScript       |
| Database   | PostgreSQL, Prisma ORM                |
| Auth       | JWT (JSON Web Tokens), bcrypt         |
| Validation | Zod                                   |

## Project Structure

```
indokerja/
├── frontend/                   # React + Vite frontend
│   ├── public/                 # Static assets (favicon, images)
│   ├── src/
│   │   ├── api/                # Axios HTTP client
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Sidebar, AppLayout, Header
│   │   │   └── shared/         # StatusBadge, ConfirmDialog, etc.
│   │   ├── contexts/           # AuthContext (React Context)
│   │   ├── pages/              # Route pages
│   │   │   ├── auth/           # LoginPage, RegisterPage
│   │   │   ├── seeker/         # JobListPage, JobDetailPage, etc.
│   │   │   └── company/        # DashboardPage, CreateJobPage, etc.
│   │   ├── services/           # API service functions
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Helper utilities
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                    # Express.js backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── migrations/         # Database migrations
│   │   └── seed.ts             # Seed script with demo data
│   ├── src/
│   │   ├── config/             # Prisma client config
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth, role, validation, error
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # Business logic layer
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # JWT, password, response helpers
│   │   └── validators/         # Zod validation schemas
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **PostgreSQL** ≥ 14.x (running locally or remotely)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/indokerja.git
cd indokerja
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/indokerja?schema=public"
JWT_SECRET="your-secure-random-secret-key"
JWT_EXPIRES_IN="24h"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

### 3. Setup Database

Create the PostgreSQL database:

```sql
CREATE DATABASE indokerja;
```

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

Load demo/seed data:

```bash
npm run prisma:seed
```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
```

Create the environment file (if not already present):

```bash
echo VITE_API_URL=http://localhost:3000/api > .env
```

### 5. Start Development Servers

**Backend** (from `backend/` directory):

```bash
npm run dev
```

Backend runs on `http://localhost:3000`

**Frontend** (from `frontend/` directory):

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                  | Example                                                              |
|----------------|------------------------------|----------------------------------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/indokerja?schema=public` |
| `JWT_SECRET`   | Secret key for JWT signing   | `your-secure-random-secret-key`                                      |
| `JWT_EXPIRES_IN` | JWT token expiry duration  | `24h`                                                                |
| `PORT`         | Backend server port          | `3000`                                                               |
| `CORS_ORIGIN`  | Allowed CORS origin          | `http://localhost:5173`                                              |

### Frontend (`frontend/.env`)

| Variable       | Description           | Example                        |
|----------------|-----------------------|--------------------------------|
| `VITE_API_URL` | Backend API base URL  | `http://localhost:3000/api`    |

## Database Setup

### Schema

The database uses 4 main tables:

- **users** — Job Seekers and Companies (single table, distinguished by `role` enum)
- **jobs** — Job listings created by Companies
- **applications** — Job applications with `@@unique([userId, jobId])` constraint
- **application_histories** — Audit trail of every status change

### Reset Database

```bash
cd backend
npx prisma migrate reset
```

This drops all data, re-runs migrations, and re-runs the seed script.

### Prisma Studio (GUI)

```bash
npx prisma studio
```

Opens a browser-based database explorer on `http://localhost:5555`.

---

## API Documentation

**Base URL:** `http://localhost:3000/api`

All authenticated endpoints require:

```http
Authorization: Bearer <token>
```

### Authentication

#### POST `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "fullName": "Budi Santoso",
  "email": "budi@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "JOB_SEEKER"
}
```

For Company accounts, include `companyName`:

```json
{
  "fullName": "Admin Company",
  "email": "admin@company.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "COMPANY",
  "companyName": "My Company"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "Budi Santoso",
      "email": "budi@example.com",
      "role": "JOB_SEEKER",
      "companyName": null
    },
    "token": "eyJhbG..."
  }
}
```

#### POST `/auth/login`

**Request Body:**

```json
{
  "email": "seeker1@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "uuid", "fullName": "Budi Santoso", "email": "seeker1@example.com", "role": "JOB_SEEKER" },
    "token": "eyJhbG..."
  }
}
```

**Error:** `401 Unauthorized` — Invalid email or password.

#### GET `/auth/me`

Get current authenticated user. Requires auth token.

**Response:** `200 OK`

---

### Jobs (Job Seeker)

#### GET `/jobs`

Browse open job listings. Requires `JOB_SEEKER` role.

**Query Parameters:**

| Param    | Type   | Default | Description               |
|----------|--------|---------|---------------------------|
| `page`   | number | 1       | Page number               |
| `limit`  | number | 10      | Items per page (max 50)   |
| `search` | string | ""      | Search by title or company |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Frontend Developer",
        "location": "Jakarta Selatan",
        "salaryMin": 8000000,
        "salaryMax": 15000000,
        "type": "FULL_TIME",
        "companyName": "TechCorp Indonesia",
        "createdAt": "2026-09-21T..."
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 4, "totalPages": 1 }
  }
}
```

#### GET `/jobs/:id`

Get job detail. Returns application status if the user has already applied.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "job": {
      "id": "uuid",
      "title": "Frontend Developer",
      "description": "...",
      "requirements": "...",
      "location": "Jakarta Selatan",
      "salaryMin": 8000000,
      "salaryMax": 15000000,
      "type": "FULL_TIME",
      "status": "OPEN",
      "companyName": "TechCorp Indonesia",
      "companyId": "uuid"
    },
    "applicationStatus": null
  }
}
```

---

### Applications (Job Seeker)

#### POST `/applications`

Apply to a job. Requires `JOB_SEEKER` role. Duplicate applications return `409`.

**Request Body:**

```json
{
  "jobId": "uuid"
}
```

**Response:** `201 Created`

**Error:** `409 Conflict` — Already applied to this job.

#### GET `/applications`

List the authenticated Job Seeker's applications.

**Query Parameters:** `page`, `limit`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "jobTitle": "Frontend Developer",
        "companyName": "TechCorp Indonesia",
        "currentStatus": "REVIEWING",
        "createdAt": "2026-09-21T...",
        "updatedAt": "2026-09-21T..."
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
  }
}
```

#### GET `/applications/:id`

Get application detail with full status history timeline.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "application": {
      "id": "uuid",
      "currentStatus": "REVIEWING",
      "job": { "id": "uuid", "title": "Frontend Developer", "companyName": "TechCorp Indonesia" },
      "history": [
        { "previousStatus": null, "newStatus": "APPLIED", "changedAt": "2026-09-15T..." },
        { "previousStatus": "APPLIED", "newStatus": "REVIEWING", "changedAt": "2026-09-21T..." }
      ]
    }
  }
}
```

**Error:** `403 Forbidden` — Cannot view another user's application.

---

### Company

All company routes require `COMPANY` role.

#### GET `/company/dashboard`

Get hiring overview stats.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "totalJobs": 3,
    "totalApplications": 4,
    "applicationsByStatus": { "APPLIED": 1, "REVIEWING": 1, "SHORTLISTED": 0, "ACCEPTED": 1, "REJECTED": 1 }
  }
}
```

#### POST `/company/jobs`

Create a new job listing.

**Request Body:**

```json
{
  "title": "Backend Engineer",
  "description": "We are looking for a backend engineer...",
  "requirements": "3+ years experience with Node.js...",
  "location": "Jakarta Pusat",
  "salaryMin": 10000000,
  "salaryMax": 18000000,
  "type": "FULL_TIME"
}
```

**Valid `type` values:** `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`

**Response:** `201 Created`

#### GET `/company/jobs`

List jobs created by the authenticated Company. Includes applicant count.

**Query Parameters:** `page`, `limit`

#### GET `/company/jobs/:jobId/applicants`

List applicants for a specific job. Only accessible by the owning Company.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "applicationId": "uuid",
        "applicantName": "Budi Santoso",
        "applicantEmail": "seeker1@example.com",
        "currentStatus": "REVIEWING",
        "appliedAt": "2026-09-15T..."
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 2, "totalPages": 1 }
  }
}
```

**Error:** `403 Forbidden` — Cannot view applicants for another company's job.

#### GET `/company/applications/:applicationId`

Get full applicant detail including profile, job info, and status timeline.

#### PATCH `/company/applications/:applicationId/status`

Update an application's status. Only valid transitions are allowed.

**Request Body:**

```json
{
  "status": "SHORTLISTED"
}
```

**Valid values:** `REVIEWING`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`

**Response:** `200 OK`

**Error:** `400 Bad Request` — Invalid status transition (e.g., `SHORTLISTED → REVIEWING`).

---

### Profile

#### GET `/profile`

Get authenticated user's profile.

#### PUT `/profile`

Update authenticated user's profile.

**Request Body (Job Seeker):**

```json
{
  "fullName": "Budi Santoso",
  "phone": "081234567890",
  "bio": "Experienced developer"
}
```

**Request Body (Company):**

```json
{
  "fullName": "Admin",
  "companyName": "TechCorp Indonesia",
  "description": "Leading tech company",
  "location": "Jakarta Selatan",
  "website": "https://techcorp.co.id"
}
```

---

## Authentication

This application uses **JWT Bearer Token** authentication.

1. Register or login to receive a token.
2. Include the token in all subsequent requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

3. Tokens expire after 24 hours (configurable via `JWT_EXPIRES_IN`).
4. Role-based access: `JOB_SEEKER` and `COMPANY` roles have separate permissions.

## Dummy / Test Data

After running `npm run prisma:seed`, the following demo accounts are available:

### Job Seeker Accounts

| Name          | Email                  | Password      |
|---------------|------------------------|---------------|
| Budi Santoso  | seeker1@example.com    | password123   |
| Siti Rahayu   | seeker2@example.com    | password123   |

### Company Accounts

| Name           | Company             | Email                  | Password      |
|----------------|---------------------|------------------------|---------------|
| Admin TechCorp | TechCorp Indonesia  | company1@example.com   | password123   |
| Admin DigiNusa | Digital Nusantara   | company2@example.com   | password123   |

### Pre-loaded Data

The seed script creates:

- **4 job listings** across 2 companies (Frontend Developer, Backend Engineer, UI/UX Design Intern, Mobile Developer)
- **5 applications** from both seekers across different jobs
- **Application history records** with varied statuses (Applied, Reviewing, Shortlisted, Accepted, Rejected)

### Reload seed data

```bash
cd backend
npx prisma migrate reset
```

This wipes the database and re-seeds all demo data.

## License

This project is for educational and assessment purposes.
