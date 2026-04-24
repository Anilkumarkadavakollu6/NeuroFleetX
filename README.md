# NeuroFleetX 🚗⚡

A full-stack fleet management platform with role-based dashboards, JWT authentication, and an AI Neural Engine for route optimisation and CO₂ savings analysis.

> **Live demo:** https://neurofleet.onrender.com

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [AI Neural Engine Setup](#ai-neural-engine-setup)
- [How It Works](#how-it-works)
  - [Authentication Flow](#authentication-flow)
  - [JWT on Every Request](#jwt-on-every-request)
  - [Ride Booking Flow](#ride-booking-flow)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

NeuroFleetX is a fleet management system built for organisations that need to track vehicles, manage drivers, and optimise routes. It supports four roles — **Admin**, **Driver**, **User**, and **Manager** — each with their own dashboard and permissions. A separate Python-powered AI Neural Engine analyses fleet data to surface route efficiency scores and CO₂ savings.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│            Browser (React + Vite)           │
│  Login │ Admin │ Driver │ User │ Manager    │
│              api.js (Axios)                 │
└────────────────────┬────────────────────────┘
                     │ HTTPS (JWT in header)
┌────────────────────▼────────────────────────┐
│         Spring Boot Backend                 │
│  SecurityConfig → JwtAuthenticationFilter   │
│  AuthController │ VehicleController │ ...   │
│         Spring Data JPA / Hibernate         │
└────────────────────┬────────────────────────┘
                     │
              ┌──────▼──────┐
              │  Database   │
              │  (users,    │
              │  vehicles)  │
              └─────────────┘

┌─────────────────────────────────────────────┐
│     AI Neural Engine (Python Flask/FastAPI) │
│     localhost:5000  — run separately        │
└─────────────────────────────────────────────┘

Ride state (current): browser localStorage
Ride state (future):  database + WebSockets
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios |
| Backend | Java 17, Spring Boot 3, Spring Security |
| Auth | JWT (JSON Web Tokens), BCrypt |
| ORM | Spring Data JPA, Hibernate |
| Database | PostgreSQL (or H2 for local dev) |
| AI Engine | Python (Flask / FastAPI) |
| Deployment | Render (backend + frontend) |

---

## Features

- **JWT authentication** — signup, login, token-based session management
- **Role-based dashboards** — Admin, Driver, User, Manager each see a tailored UI
- **Vehicle management** — CRUD operations via REST API
- **Ride booking** — User books a ride; Driver sees and accepts it in real time (via localStorage bridge)
- **AI Neural Engine** — Python server calculates optimised routes and CO₂ savings
- **Deployed on Render** — backend auto-deploys from the main branch

---

## Getting Started

### Prerequisites

- **Java 17+** — [Download](https://adoptium.net/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Python 3.9+** — [Download](https://python.org/) *(for Neural Engine only)*
- **Maven** — bundled with most IDEs, or install separately
- A running **PostgreSQL** instance, or use the H2 in-memory database for local testing

---

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/neurofleetx.git
cd neurofleetx/backend

# 2. Configure your database in src/main/resources/application.properties
#    (see Environment Variables section below)

# 3. Build and run
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.

---

### Frontend Setup

```bash
cd neurofleetx/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend starts on `http://localhost:5173`. It points to `https://neurofleet.onrender.com` by default — change the base URL in `src/api.js` if you want it to talk to your local backend instead.

---

### AI Neural Engine Setup

The Neural Engine is a **separate Python server** and is **not deployed** — it only runs locally.

```bash
cd neurofleetx/neural-engine

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

It runs on `http://localhost:5000`. Once running, the "Run Neural Engine" button in the dashboard will work. Without it, the app shows **"Neural Engine offline"** — this is expected on the deployed version.

---

## How It Works

### Authentication Flow

**Signup**
1. The React form calls `api.post("/auth/signup", { name, email, password, role })`.
2. Spring Boot's `SecurityConfig` sees that `/api/auth/**` is public — no token required.
3. `AuthController` checks for duplicate emails, hashes the password with BCrypt, saves the user via `UserRepository` (Spring Data JPA runs the INSERT automatically).
4. Returns `{ message: "User registered successfully" }`.

**Login**
1. `AuthController.login()` calls `authenticationManager.authenticate()`, which triggers `CustomUserDetailsService` to load the user and compare the BCrypt hash.
2. On success, `JwtUtil.generateToken(email, role)` creates a signed JWT containing the email, role, and expiry.
3. The frontend stores `token` and `role` in `localStorage`, then routes to the correct dashboard.

---

### JWT on Every Request

- `api.js` has an Axios **request interceptor** that automatically adds `Authorization: Bearer <token>` to every outgoing request.
- Spring Boot's `JwtAuthenticationFilter` extracts and verifies the token before the request reaches any controller.
- If valid, the user is placed into Spring's security context — all controllers know who is making the request without any extra code.

---

### Ride Booking Flow

> **Note:** Rides currently use `localStorage` as a bridge — no server involved yet.

1. **User books** → writes a trip object to `localStorage` under key `neurofleetx_trips`.
2. **Driver dashboard** polls `localStorage` every 2 seconds → sees the new trip → shows an accept popup.
3. **Driver accepts** → updates trip status to `"In Progress"` in `localStorage`.
4. **User dashboard** polls every 2 seconds → sees `"In Progress"` → shows Live Tracking view.
5. Either side ends the trip → status becomes `"Completed"`.

⚠️ Both dashboards must be open **in the same browser** for this to work. A proper implementation would use a `trips` table and polling endpoints or WebSockets — see [Roadmap](#roadmap).

---

## Folder Structure

```
neurofleetx/
├── backend/                    # Spring Boot application
│   └── src/main/java/
│       ├── controller/         # AuthController, VehicleController, etc.
│       ├── model/              # User, Vehicle entity classes
│       ├── repository/         # Spring Data JPA repositories
│       ├── security/           # SecurityConfig, JwtFilter, JwtUtil
│       └── service/            # CustomUserDetailsService
├── frontend/                   # React + Vite application
│   └── src/
│       ├── pages/              # LoginPage, AdminDashboard, UserDashboard, etc.
│       ├── components/         # Shared UI components
│       └── api.js              # Axios instance with JWT interceptor
└── neural-engine/              # Python AI server
    ├── app.py                  # Flask/FastAPI entry point
    └── requirements.txt
```

---

## Environment Variables

### Backend — `src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/neurofleetx
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=YOUR_LONG_RANDOM_SECRET_KEY
jwt.expiration=86400000
```

### Frontend — `src/api.js`

```js
const BASE_URL = "https://neurofleet.onrender.com/api";
// Change to http://localhost:8080/api for local development
```

> ⚠️ Never commit `application.properties` with real credentials to GitHub. Add it to `.gitignore` and use environment variables on your deployment platform.

---

## Known Limitations

| Limitation | Details |
|---|---|
| Ride state in localStorage | Rides only work when User and Driver dashboards are open in the same browser — not across devices |
| Neural Engine not deployed | The Python server only runs locally; the deployed app shows "Neural Engine offline" |
| No trips table yet | Trip data is not persisted in the database |

---

## Roadmap

- [ ] Move ride state from localStorage → PostgreSQL `trips` table
- [ ] Add WebSocket support for real-time ride updates across devices
- [ ] Deploy the Neural Engine (e.g. Render, Railway, or Fly.io)
- [ ] Add a Manager analytics dashboard with live data
- [ ] Write unit and integration tests for Auth and Vehicle endpoints

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
