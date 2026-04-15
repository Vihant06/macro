# Macro - Nutrition Tracking Backend

A production-grade nutrition tracking backend inspired by MacroFactor, built with NestJS and MongoDB.

## Features

- **Authentication**: JWT-based auth with access + refresh tokens
- **User Profiles**: Track age, gender, height, weight, activity level, and goals
- **Macro Goals**: Calculate personalized calorie and macro targets (Mifflin-St Jeor equation)
- **Food Logging**: Log meals with detailed macro breakdown
- **Weight Tracking**: Track weight over time with trend analysis
- **Recipes**: Create and manage custom recipes
- **Analytics**: Daily summaries, weekly trends, and progress insights

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: NestJS
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (access + refresh tokens) with bcrypt
- **Validation**: class-validator + class-transformer

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets

# Start development server
npm run start:dev

# Build for production
npm run build
npm run start:prod
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret for access tokens | Required |
| `JWT_EXPIRATION` | Access token expiry | `15m` |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens | Required |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token expiry | `7d` |
| `PORT` | Server port | `3000` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `10` |

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login, get tokens | No |
| POST | `/auth/logout` | Logout, invalidate tokens | Yes |
| POST | `/auth/refresh` | Refresh access token | No |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get user profile | Yes |
| PATCH | `/users/profile` | Update profile | Yes |
| GET | `/users/goals` | Get macro goals | Yes |
| PATCH | `/users/goals` | Update goals | Yes |
| POST | `/users/goals/calculate` | Calculate goals from stats | Yes |

### Food Logging

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/food` | Create food entry | Yes |
| GET | `/food` | Get entries (query: date, mealType) | Yes |
| GET | `/food/daily-totals` | Get daily macro totals | Yes |
| GET | `/food/:id` | Get single entry | Yes |
| PATCH | `/food/:id` | Update entry | Yes |
| DELETE | `/food/:id` | Delete entry | Yes |

### Macros

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/macros/today` | Today's totals vs goals | Yes |
| GET | `/macros/week` | Weekly summary | Yes |
| GET | `/macros/distribution` | Macro distribution | Yes |
| GET | `/macros/monthly` | Monthly trend data | Yes |

### Weight Tracking

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/weight` | Log weight | Yes |
| GET | `/weight` | Get weight history | Yes |
| GET | `/weight/trend` | Get trend analysis | Yes |
| GET | `/weight/:id` | Get single log | Yes |
| PATCH | `/weight/:id` | Update log | Yes |
| DELETE | `/weight/:id` | Delete log | Yes |

### Recipes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/recipes` | Create recipe | Yes |
| GET | `/recipes` | Get all recipes | Yes |
| GET | `/recipes/:id` | Get single recipe | Yes |
| PATCH | `/recipes/:id` | Update recipe | Yes |
| DELETE | `/recipes/:id` | Delete recipe | Yes |

### Analytics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/analytics/daily` | Daily summary | Yes |
| GET | `/analytics/weekly` | Weekly trends | Yes |
| GET | `/analytics/macros` | Macro distribution | Yes |
| GET | `/analytics/insights` | Progress insights | Yes |

## Example Usage

### Register a New User

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Log a Meal

```bash
curl -X POST http://localhost:3000/food \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{
    "foodName": "Chicken Breast",
    "mealType": "lunch",
    "date": "2024-01-15",
    "servingSize": 200,
    "calories": 330,
    "protein": 62,
    "carbs": 0,
    "fat": 7
  }'
```

### Get Today's Macros

```bash
curl http://localhost:3000/macros/today \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### Calculate Macro Goals

```bash
curl -X POST http://localhost:3000/users/goals/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -d '{
    "age": 30,
    "weight": 80,
    "height": 180,
    "activityLevel": 3,
    "goal": -1
  }'
```

Activity Levels:
- 1: Sedentary
- 2: Lightly active
- 3: Moderately active
- 4: Very active
- 5: Extremely active

Goals:
- -1: Lose weight
- 0: Maintain
- 1: Gain muscle

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── main.ts                   # Entry point
├── app.module.ts             # Root module
├── auth/                     # Authentication
│   ├── controller.ts
│   ├── service.ts
│   ├── strategies/jwt.strategy.ts
│   ├── guards/jwt-auth.guard.ts
│   └── dto/
├── users/                    # User profiles & goals
│   ├── controller.ts
│   ├── service.ts
│   ├── schemas/user.schema.ts
│   └── dto/
├── food/                     # Food logging
│   ├── controller.ts
│   ├── service.ts
│   ├── schemas/food-entry.schema.ts
│   └── dto/
├── macros/                   # Macro tracking engine
│   ├── controller.ts
│   └── service.ts
├── weight/                   # Weight tracking
│   ├── controller.ts
│   ├── service.ts
│   ├── schemas/weight-log.schema.ts
│   └── dto/
├── recipes/                  # Recipe management
│   ├── controller.ts
│   ├── service.ts
│   ├── schemas/recipe.schema.ts
│   └── dto/
├── analytics/                # Analytics & insights
│   ├── controller.ts
│   └── service.ts
└── common/                   # Shared utilities
    ├── decorators/
    ├── guards/
    ├── filters/
    └── interceptors/
```

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT access tokens (15 min expiry)
- Refresh tokens with rotation (7 day expiry)
- Input validation on all endpoints
- User data isolation (users can only access their own data)

## License

MIT
