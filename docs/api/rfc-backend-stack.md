# RFC: Backend Stack and API Platform for Macros

- **Status:** Proposed
- **Date:** 2026-04-13
- **Owner:** Frontend/Platform

## Context

The current frontend is a TypeScript/Vite app with multiple product surfaces (dashboard, food logging, workouts, progress, profile). We need a backend contract that supports:
- low-latency read APIs for dashboard/progress views,
- write-heavy nutrition/workout logging,
- strict API versioning and consistent error envelopes,
- OpenAPI-first collaboration between frontend and backend.

## Decision

Adopt the following backend stack:

1. **Runtime & Framework:** Node.js 22 + Fastify (TypeScript)
2. **Primary DB:** PostgreSQL 16
3. **Cache / ephemeral state:** Redis 7
4. **Object storage:** S3-compatible bucket (AWS S3, Cloudflare R2, or MinIO)
5. **ORM / SQL toolkit:** Prisma for CRUD + SQL migrations for advanced analytics queries
6. **Async jobs:** BullMQ (Redis-backed) for background processing (coaching computations, notification fanout)
7. **API contract:** OpenAPI 3.1 (`docs/api/openapi.v1.yaml`) as source of truth

## Why this stack

- **Fastify** gives strong TypeScript ergonomics and high throughput for mobile-style APIs.
- **Postgres** provides reliable transactional behavior for logs, workouts, and profile data.
- **Redis** handles caching, rate-limit counters, and short-lived session data.
- **S3-compatible storage** supports food image uploads and future media content.
- **OpenAPI-first** enables generated clients, schema validation, and tight FE/BE synchronization.

## API Namespace + Error Standard

All REST endpoints are served under:
- `/api/v1/*`

All non-2xx errors must return:

```json
{
  "code": "RESOURCE_NOT_FOUND",
  "message": "Workout not found",
  "details": {
    "workout_id": "wkt_123"
  },
  "request_id": "req_01J..."
}
```

### Error field rules

- `code` (string, required): Stable machine-readable code.
- `message` (string, required): Human-readable message safe for UI.
- `details` (object|null, optional): Structured diagnostics and field-level issues.
- `request_id` (string, required): Trace identifier propagated via logs/telemetry.

## Authentication and authorization

- JWT access token (short TTL) + refresh token rotation.
- Role-based access with 3 levels:
  - `public`
  - `user`
  - `admin`

## Consequences

### Positive
- Clear service boundaries and incremental scalability.
- Easier client generation and contract testing via OpenAPI.
- Consistent error handling across all API consumers.

### Trade-offs
- Requires contract governance discipline (OpenAPI reviews for every API change).
- Dual data-access approach (Prisma + SQL migrations) adds some operational complexity.

## Source of truth

`docs/api/openapi.v1.yaml` is authoritative for request/response schemas, auth, and paths.
Any backend implementation PR must align with this contract or update it in the same PR.
Operations in the OpenAPI contract also include an `x-auth-level` extension (`public`, `user`, `admin`) to make authorization requirements explicit for generated docs and client teams.
