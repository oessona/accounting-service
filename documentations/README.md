# Accounting Service

## 1. Project Overview

**Accounting Service** is a web-based accounting application developed as a **university project**. The system allows users to manage personal finances by creating accounts, tracking income and expenses, and viewing financial reports. The project demonstrates modern full-stack development practices, secure authentication, and containerized deployment.

The application follows a client–server architecture with a React-based frontend and a Laravel REST API backend.

---

## 2. Features

### User Management

* User registration and login (email and password)
* JWT-based authentication using Laravel Sanctum
* Role-based access control (admin and regular user)
* Secure password hashing and session handling

### Account Management

* Creation and management of multiple account types
* Real-time balance tracking
* Visual account cards with type-specific icons

### Transaction Management

* Recording income and expense transactions
* Transaction categorization (e.g., salary, groceries, utilities)
* Transaction status tracking (processing, done, failed)
* Linking transactions to specific accounts
* Editing and deleting transactions

### Financial Reports

* Dashboard with summarized financial data
* Report pages based on stored transactions

### Admin Panel

* User management functionality for administrators

---

## 3. Technology Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS

### Backend

* Laravel (PHP 8.2)
* Laravel Sanctum (JWT authentication)
* REST API architecture

### Database

* PostgreSQL 15
* Database migrations for schema management

### Infrastructure

* Docker
* Nginx (as a reverse proxy for the backend)

---

## 4. System Architecture

* Frontend communicates with backend via REST API over HTTPS
* Backend handles authentication, business logic, and data persistence
* PostgreSQL stores user, account, and transaction data
* Docker is used to containerize backend services
* Nginx is used to route requests to the Laravel application

Detailed architecture description is available in `Architecture.md`.

---

## 5. Project Structure (Backend)

```
backend/
├── app/Http/Controllers/   # Controllers with request handling and business logic
├── database/migrations/    # Database schema migrations
├── routes/                 # API routes
├── docker/                 # Docker and Nginx configuration
├── docker-compose.yml
```

---

## 6. Setup and Installation

### Prerequisites

* Docker
* Docker Compose
* Node.js (for frontend development)

### Backend Setup

1. Clone the repository
2. Navigate to the backend directory
3. Create an environment file:

   ```
   cp .env.example .env
   ```
4. Build and start Docker containers:

   ```
   docker-compose up --build
   ```
5. Run database migrations:

   ```
   docker-compose exec app php artisan migrate
   ```

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies:

   ```
   npm install
   ```
3. Start the development server:

   ```
   npm run dev
   ```

---

## 7. Authentication

* Authentication is implemented using Laravel Sanctum
* JWT tokens are issued upon successful login
* Protected routes require a valid token
* Role-based access is enforced on both frontend and backend

---

## 8. API Documentation

The API is documented using **Swagger / OpenAPI**.

> API documentation is provided separately and describes all available endpoints, request formats, and response schemas.

---

## 9. Development Notes

* Business logic is implemented directly in controllers for simplicity, which is acceptable for an MVP and academic project
* Database schema changes are handled exclusively via migrations
* The architecture allows future refactoring into service layers if required

---

## 10. Conclusion

The Accounting Service project demonstrates a complete full-stack web application with authentication, authorization, financial data management, and containerized deployment. The system meets all functional and non-functional requirements defined for the academic project.
