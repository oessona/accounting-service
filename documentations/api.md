# Accounting Service API Documentation

## 1. Overview
The Accounting Service API provides a REST interface for managing users, accounts, transactions, dashboards, and reports.

- **Backend:** Laravel 8+
- **Authentication:** JWT via Laravel Sanctum
- **Frontend integration:** Next.js + TypeScript + Tailwind CSS
- **Base URL:** `/api`
- **Response format:** JSON
- **Error handling:** Standard HTTP codes + `errors` object

---

## 2. Authentication Endpoints

| Method | Path      | Description            | Auth Required |
|--------|-----------|------------------------|---------------|
| POST   | /register | Register a new user    | ❌            |
| POST   | /login    | Login a user           | ❌            |
| POST   | /logout   | Logout the current user| ✅            |

**Notes:**
- Passwords are only sent for `POST /register` and `POST /login`.
- Protected routes require header: `Authorization: Bearer {token}`.

---

## 3. User Endpoints

| Method | Path   | Description                     | Auth Required |
|--------|--------|---------------------------------|---------------|
| GET    | /user  | Get the currently logged-in user| ✅            |

---

## 4. Accounts Endpoints

| Method | Path             | Description              | Auth Required |
|--------|------------------|--------------------------|---------------|
| GET    | /accounts        | Get all accounts for user| ✅            |
| POST   | /accounts        | Create a new account     | ✅            |
| PUT    | /accounts/{id}   | Update an existing account| ✅           |
| DELETE | /accounts/{id}   | Delete an account        | ✅            |

**Request Example (POST /accounts):**
```json
{
  "account_type": "Checking"
}
```
## 5. Transactions Endpoints

| Method | Path                      | Description                   | Auth Required |
|--------|---------------------------|-------------------------------|---------------|
| GET    | /transactions             | Get all transactions          | ✅            |
| POST   | /transactions             | Create a new transaction      | ✅            |
| PUT    | /transactions/{id}        | Update a transaction          | ✅            |
| DELETE | /transactions/{id}        | Delete a transaction          | ✅            |
| GET    | /transactions/stats/today | Get today's transaction stats | ✅            |

**Request Example (POST /transactions):**
```json
{
  "amount": 1200.50,
  "type": "income",
  "category": "Salary",
  "status": "processing",
  "transaction_date": "2025-12-18"
}
```
## 6. Dashboard Endpoint

| Method | Path       | Description                                                   | Auth Required |
|--------|------------|---------------------------------------------------------------|---------------|
| GET    | /dashboard | Retrieve user statistics, income/expenses, growth, chart data | ✅            |

**Response Example:**
```json
{
  "userName": "Aruana Sagyndyk",
  "TotalValue": 5000.0,
  "IncomeValue": 7000.0,
  "ExpenseValue": 2000.0,
  "todaysActivity": 3,
  "growthInPercent": "+20.0%",
  "monthlyData": {
    "months": ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "income": [1000, 1200, 1100, 1300, 1500, 7000],
    "expense": [500, 400, 600, 800, 900, 2000],
    "chartData": [
      {"month":"Jul","income":1000,"expense":500},
      {"month":"Aug","income":1200,"expense":400}
      // ...
    ]
  }
}
```
## 7. Reports Endpoints

| Method | Path                  | Description                 | Auth Required |
|--------|-----------------------|-----------------------------|---------------|
| GET    | /reports/summary      | Get financial summary report| ✅            |
| GET    | /reports/transactions | Get all transactions report | ✅            |

---

## 8. Admin Endpoints

| Method | Path              | Description                     | Auth Required |
|--------|-------------------|---------------------------------|---------------|
| GET    | /admin/users      | Get all users (Admin only)      | ✅            |
| DELETE | /admin/users/{id} | Delete a user (Admin only)      | ✅            |
| GET    | /admin/activity   | Get system activity (Admin only)| ✅            |

**Notes:**
- Admin endpoints are protected by role check (`$user->role === 'admin'`).
- Middleware for admin verification is recommended for production.

---

## 9. Error Handling

| HTTP Code | Meaning                          |
|-----------|----------------------------------|
| 200       | OK                               |
| 201       | Created                          |
| 401       | Unauthorized (invalid token)     |
| 403       | Forbidden (insufficient role)    |
| 404       | Resource not found               |
| 422       | Validation error (invalid input) |

**Error Response Example:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Invalid credentials"]
  }
}
```
## 10. Notes

- Dates must be in `YYYY-MM-DD` format.
- All amounts are floats (decimal with 2 digits).
- Swagger/OpenAPI specification is available separately (`swagger.yml`) for automated client generation.
