# UI Action Inventory and API Contract Mapping

This document inventories the **currently implemented UI screens** in the app and defines the backend contract for each user action.

> Note: There are currently **no Login or Signup screens implemented in the frontend**. Authentication-related endpoints are still defined in the OpenAPI contract to unblock frontend-backend integration.

## Screen Inventory

Implemented screens in `src/main.ts`:
- Home (`screen-home`)
- Food (`screen-food`)
- Workout (`screen-workout`)
- Progress (`screen-progress`)
- Profile (`screen-profile`)
- Global bottom navigation (`bottom-nav`)

## Action Matrix

All API paths below are versioned under `/api/v1`.

| Screen | UI Action | Endpoint | Request Payload | Response Schema | Auth |
|---|---|---|---|---|---|
| Global | Switch tab (Home/Food/Workout/Progress/Profile) | `GET /api/v1/me/navigation-state` | none | `{ active_screen, last_visited_at }` | user |
| Home | Load dashboard summary | `GET /api/v1/dashboard/summary` | none | `{ calories, macros, weight, adherence }` | user |
| Home | Tap notifications icon | `GET /api/v1/notifications?unread_only=true` | query only | `{ items: Notification[], unread_count }` | user |
| Home | Tap “Log your lunch?” nudge | `POST /api/v1/food/logs` | `{ consumed_at, meal_type, entries[] }` | `FoodLog` | user |
| Food | Search food | `GET /api/v1/foods/search?q=<term>&limit=20` | query only | `{ items: Food[], total }` | user |
| Food | Quick add preset food | `POST /api/v1/food/logs/quick-add` | `{ food_id, serving_qty, serving_unit, meal_type }` | `{ log_id, totals_after }` | user |
| Food | Add suggested food item | `POST /api/v1/food/logs/quick-add` | `{ food_id, serving_qty, serving_unit, meal_type }` | `{ log_id, totals_after }` | user |
| Food | Tap scan barcode icon | `POST /api/v1/foods/barcode/lookup` | `{ barcode }` | `{ food }` | user |
| Food | FAB add custom food | `POST /api/v1/foods/custom` | `{ name, brand, serving_size, nutrients }` | `Food` | user |
| Workout | Load active workout | `GET /api/v1/workouts/active` | none | `WorkoutSession` | user |
| Workout | Tap history icon | `GET /api/v1/workouts/history?limit=20` | query only | `{ items: WorkoutSummary[] }` | user |
| Workout | Add set to exercise | `POST /api/v1/workouts/{workout_id}/exercises/{exercise_id}/sets` | `{ reps, weight, rpe, is_completed }` | `WorkoutSet` | user |
| Progress | Load progress dashboard | `GET /api/v1/progress/overview?range=30d` | query only | `{ weight_trend, macro_distribution, energy_balance, stats }` | user |
| Progress | Change filter/range | `GET /api/v1/progress/overview?range=7d\|30d\|90d` | query only | same as above | user |
| Profile | Load profile details | `GET /api/v1/me/profile` | none | `UserProfile` | user |
| Profile | Tap settings icon / update settings | `PATCH /api/v1/me/settings` | `{ units, notifications, privacy }` | `UserSettings` | user |
| Profile | View coaching insights | `GET /api/v1/coaching/insights?limit=10` | query only | `{ items: CoachingInsight[] }` | user |

## Auth Flows (Planned; not yet represented in UI)

| Future Screen | UI Action | Endpoint | Request Payload | Response Schema | Auth |
|---|---|---|---|---|---|
| Login | Sign in | `POST /api/v1/auth/login` | `{ email, password }` | `{ access_token, refresh_token, user }` | public |
| Signup | Create account | `POST /api/v1/auth/signup` | `{ email, password, name }` | `{ user_id, email_verification_required }` | public |
| Settings/Security | Refresh token | `POST /api/v1/auth/refresh` | `{ refresh_token }` | `{ access_token, refresh_token }` | public |
| Settings/Security | Sign out | `POST /api/v1/auth/logout` | `{ refresh_token }` | `{ success: true }` | user |

## Admin-only Backoffice Actions (not in current app UI)

| Action | Endpoint | Request Payload | Response Schema | Auth |
|---|---|---|---|---|
| List users | `GET /api/v1/admin/users?cursor=&limit=` | query only | `{ items: AdminUser[], next_cursor }` | admin |
| Moderate custom foods | `PATCH /api/v1/admin/foods/{food_id}/moderation` | `{ status, reason }` | `{ food_id, status }` | admin |
| Feature flag update | `PATCH /api/v1/admin/flags/{flag}` | `{ enabled }` | `{ flag, enabled }` | admin |

