# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# 🧠 Project: Macro (Nutrition Tracking Backend)

## Overview

Macro is a production-grade nutrition tracking backend inspired by MacroFactor.
It is designed to support scalable user tracking, macro calculations, food logging, and advanced analytics.

The system must be built with **clean architecture, high performance, and extensibility for future AI features**.

---

# ⚙️ Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** NestJS
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (access + refresh tokens) with bcrypt
- **Validation:** class-validator + class-transformer

---

# 🚀 Core Features

Users should be able to:

- Log meals with detailed macro breakdown (protein, carbs, fats, calories)
- Track daily and weekly nutrition intake
- Track body weight over time
- View progress analytics and trends
- Receive adaptive calorie targets (future AI feature)

---

# 🔐 Authentication & User Management (STRICT)

## Rules

- Authentication must be **email + password only**
- OAuth, Google login, phone login, or social auth

## Sign Up

Required fields:

- name
- email (must be unique)
- password (hashed using bcrypt)

## Login

Required fields:

- email
- password

## Logout

- Must invalidate tokens (blacklist or rotation strategy)

## Auth Requirements

- Use JWT (access + refresh tokens)
- Implement refresh token rotation
- Secure password hashing (bcrypt)
- Handle:
  - invalid credentials
  - duplicate email registration
  - expired tokens
  - unauthorized access

---

# 🏗️ Architecture

```
src/
├── main.ts              # App entry, global config
├── app.module.ts        # Root module
├── auth/                # Authentication module
├── users/               # User profiles, goals
├── food/                # Food database & tracking
├── recipes/             # Recipes & macro calculations
├── progress/            # Weight logs & analytics
├── analytics/           # Aggregations & insights
└── common/              # Shared utilities
```

---

# 🧩 Module Pattern (MANDATORY)

Each module must follow NestJS + clean architecture:

- **Controller**
  - Handles HTTP requests/responses only
  - No business logic

- **Service**
  - Contains all business logic

- **Repository (or Mongoose Model layer)**
  - Handles database operations

- **DTOs**
  - Use class-validator for validation

- **Schemas**
  - Defined using Mongoose

---

# ❌ Strict Rules (DO NOT VIOLATE)

- No business logic in controllers
- No direct DB access from controllers
- No mixing of concerns
- No unvalidated input

---

# 🗄️ Data & System Design

Design system for:

- High-frequency logging (multiple meals per day)
- Fast dashboard reads
- Efficient analytics queries

## Optimization Goals

- Index on: `userId`, `date`
- Use aggregation pipelines for:
  - daily totals
  - weekly trends

- Minimize database calls

---

# 📦 Core Modules

## 1. Auth Module

- Signup, login, logout
- JWT + refresh tokens
- Password hashing

## 2. Food Logging Module

- Create meals
- Add food items
- Store macros per entry
- Support multiple meals/day

## 3. Macro Tracking Engine

- Calculate:
  - total daily calories
  - protein, carbs, fats

- Remaining calories/macros

## 4. Weight Tracking Module

- Daily weight logs
- Trend analysis

## 5. Analytics Module

- Daily summaries
- Weekly trends
- Macro distribution
- Progress insights

---

# 🧪 Validation & Error Handling

- Use class-validator DTOs
- Global validation pipe
- Centralized exception filters
- Consistent API response format

---

# ⚡ Performance & Scalability

Design for:

- 100k+ users
- Concurrent usage

## Requirements

- Efficient schema design
- Proper indexing
- Aggregation pipelines
- Pagination for large datasets

---

# 🔒 Security Best Practices

- Hash passwords (bcrypt)
- Validate all inputs
- Protect routes with guards
- Prevent:
  - injection attacks
  - unauthorized access

---

# 🧾 Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/macro
JWT_SECRET=your-secret-key
PORT=3000
```

---

# 🐳 MongoDB Setup

```bash
docker-compose up -d
```

---

# 🧪 Testing

- Unit tests → Jest
- E2E tests → Supertest
- Test files → `.spec.ts`

---

# 🛠️ Commands

```bash
npm install
npm run start:dev
npm run build
npm run start:prod
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
npm run lint
npm run format
```

---

# 🧠 Future AI Capabilities

Design system to support:

- Adaptive calorie adjustments
- Weight trend smoothing
- Personalized macro recommendations

---

# 📌 Output Expectations from Claude

When generating backend code:

- Follow NestJS + clean architecture
- Include:
  - folder structure
  - schemas
  - DTOs
  - controllers
  - services

- Include validation & error handling
- Write scalable, production-grade code

---
