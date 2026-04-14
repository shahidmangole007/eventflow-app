<div align="center">

# ⚡ EventFlow

### A production-grade event management platform built with microservices architecture

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📌 Overview

**EventFlow** is a scalable, event-driven platform for managing events, tickets, and notifications. Built with a microservices architecture using NestJS, it demonstrates real-world patterns like async communication via Kafka, distributed caching with Redis, and type-safe data access using Drizzle ORM.

---

## 🏗️ Architecture

```
                        ┌─────────────────────┐
                        │     API Gateway      │
                        │  (Global Exception   │
                        │Filter + Interceptors)│
                        └────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌────────▼──────┐  ┌────────▼──────┐  ┌───────▼────────┐
     │ Auth Service  │  │ Event Service │  │ Ticket Service │
     │               │  │               │  │                │
     │ JWT Auth      │  │ CRUD Events   │  │ Book Tickets   │
     │ Role Guards   │  │ Redis Cache   │  │ Availability   │
     └───────────────┘  └───────────────┘  └────────────────┘
              │                  │                  │
              └──────────────────▼──────────────────┘
                          ┌──────────────┐
                          │    Kafka     │
                          │  (Message    │
                          │   Broker)   │
                          └──────┬───────┘
                                 │
                        ┌────────▼────────┐
                        │Notification Svc │
                        │                 │
                        │ Email / Push    │
                        │ Alerts          │
                        └─────────────────┘
```

---

## 🚀 Key Features

### Microservices Architecture
Decoupled logic split into **Auth**, **Events**, **Tickets**, and **Notification** services — each independently deployable and scalable.

### Event-Driven Communication
**Apache Kafka** handles asynchronous workflows between services. For example, when a user books a ticket, the Ticket service produces a Kafka event which the Notification service consumes to trigger alerts — all without tight coupling.

### Production-Grade Data Layer
**PostgreSQL** with **Drizzle ORM** for fully type-safe, migration-tracked database interactions across all services.

### Robust API Gateway
A single entry point for all client requests featuring:
- Global Exception Filters for consistent error responses
- Response Interceptors for unified response structure
- JWT authentication and role-based access control

### Shared Microservices Library
A custom internal package (`libs/`) shared across all services containing:
- Common DTOs and interfaces
- Shared utilities and helpers
- Kafka topic constants

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (Monorepo) |
| Language | TypeScript |
| Message Broker | Apache Kafka |
| Cache | Redis |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Containerization | Docker & Docker Compose |
| Auth | JWT (JSON Web Tokens) |

---

## 📁 Project Structure

```
eventflow-app/
├── apps/
│   ├── api-gateway/          # Central entry point, routing, global filters
│   ├── auth-service/         # JWT auth, user management, role guards
│   ├── event-service/        # Event CRUD, Redis caching
│   ├── ticket-service/       # Ticket booking, availability management
│   └── notification-service/ # Kafka consumer, email/push notifications
├── libs/
│   └── shared/               # Shared DTOs, interfaces, Kafka topics
├── drizzle/
│   └── migrations/           # Database migration files
├── docker-compose.yaml        # Full stack local setup
└── drizzle.config.ts         # Drizzle ORM configuration
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/shahidmangole007/eventflow-app.git
cd eventflow-app
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start infrastructure with Docker

```bash
docker-compose up -d
```

This will spin up:
- PostgreSQL database
- Apache Kafka + Zookeeper
- Redis cache

### 4. Install dependencies

```bash
npm install
```

### 5. Run database migrations

```bash
npm run drizzle:migrate
```

### 6. Start all services

```bash
# Start all microservices in watch mode
npm run start:dev

# Or start individual services
npm run start:dev auth-service
npm run start:dev event-service
npm run start:dev ticket-service
npm run start:dev notification-service
```

---

## 🔌 API Endpoints

### Auth Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/auth/profile` | Get current user profile |

### Event Service
| Method | Endpoint | Description |
|---|---|---|
| GET | `/events` | Get all events (cached in Redis) |
| GET | `/events/:id` | Get event by ID |
| POST | `/events` | Create a new event |
| PUT | `/events/:id` | Update an event |
| DELETE | `/events/:id` | Delete an event |

### Ticket Service
| Method | Endpoint | Description |
|---|---|---|
| POST | `/tickets/book` | Book a ticket for an event |
| GET | `/tickets/my-tickets` | Get user's booked tickets |
| GET | `/tickets/:id` | Get ticket details |

---

## 📨 Kafka Topics

| Topic | Producer | Consumer | Description |
|---|---|---|---|
| `ticket.booked` | Ticket Service | Notification Service | Triggered when a ticket is booked |
| `event.created` | Event Service | Notification Service | Triggered when a new event is published |
| `user.registered` | Auth Service | Notification Service | Triggered on new user signup |

---

## 🐳 Docker Compose Services

```yaml
Services started via docker-compose up:
  - postgres      → Port 5432
  - redis         → Port 6379
  - zookeeper     → Port 2181
  - kafka         → Port 9092
```

---

## 🧠 Design Decisions

**Why Kafka over direct HTTP calls?**
Kafka decouples services so that if the Notification service goes down, no ticket booking is lost. Events are retained and processed when the service recovers — something synchronous HTTP calls can't guarantee.

**Why Drizzle ORM over TypeORM?**
Drizzle provides a more lightweight, fully type-safe SQL experience with excellent TypeScript inference. Migrations are predictable and the query builder stays close to raw SQL.

**Why a shared `libs/` package?**
Avoids DTO duplication across services. A single source of truth for interfaces means changes propagate instantly without copy-pasting across microservices.

---

## 👨‍💻 Author

**Shahid Mangole**
- GitHub: [@shahidmangole007](https://github.com/shahidmangole007)
- LinkedIn: [linkedin.com/in/shahidmangole](https://linkedin.com/in/shahidmangole)

---

## 📄 License

This project is [MIT licensed](LICENSE).
