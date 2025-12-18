# System Architecture — Accounting Service

## 1. Overview

This document describes the system architecture of the **Accounting Service** application. The system follows a modern client–server architecture with a clear separation between frontend, backend, and database layers. The architecture is designed to ensure security, scalability, and maintainability, in accordance with academic and industry best practices.

---

## 2. High-Level Architecture

The system consists of three main components:

* **Frontend**: Next.js 15 application (React 19, TypeScript, Tailwind CSS)
* **Backend**: Laravel REST API (PHP 8.2) with Sanctum authentication
* **Database**: PostgreSQL 15 relational database

```
[ Client (Browser) ]
        |
        | HTTPS (REST API, JWT)
        v
[ Frontend (Next.js) ]
        |
        | API Requests
        v
[ Backend (Laravel API) ]
        |
        | ORM / SQL Queries
        v
[ PostgreSQL Database ]
```

---

## 3. Frontend Architecture

The frontend is implemented using **Next.js 15** with **React 19** and **TypeScript**.

### 3.1 Structure

* Pages represent main routes:

    * Login
    * Signup
    * Dashboard
    * Accounts
    * Transactions
    * Reports
    * User Settings
    * Admin Panel

* Reusable UI components:

    * Navigation bar
    * Forms
    * Account cards
    * Charts

### 3.2 Routing and Protection

* Public routes: login, signup
* Protected routes: dashboard, accounts, transactions, reports, admin
* Route protection is implemented using JWT token validation

### 3.3 State Management

* Authentication state is managed using stored JWT tokens
* API communication is handled via HTTP requests to the Laravel backend

---

## 4. Backend Architecture

The backend is implemented as a **RESTful API** using **Laravel (PHP 8.2)**.

### 4.1 Layered Structure

* Controllers: handle HTTP requests
* Services: contain business logic
* Models: represent database entities
* Middleware: authentication and authorization

### 4.2 Authentication and Authorization

* Authentication is implemented using **Laravel Sanctum**
* JWT tokens are issued upon successful login
* Middleware ensures that only authenticated users can access protected endpoints
* Role-based access control distinguishes between admin and regular users

---

## 5. Database Architecture

The system uses **PostgreSQL 15** as the primary database.

### 5.1 Main Tables

* **users**

    * id
    * name
    * email
    * password
    * role

* **accounts**

    * id
    * user_id
    * account_type
    * balance

* **transactions**

    * id
    * account_id
    * amount
    * category
    * type (income / expense)
    * status
    * created_at

* **personal_access_tokens**

    * tokenable_id
    * token
    * abilities

### 5.2 Relationships

* One user can have multiple accounts
* One account can have multiple transactions

---

## 6. Request Flow Example

### 6.1 User Login Flow

1. User submits login credentials via frontend
2. Frontend sends request to backend API
3. Backend validates credentials
4. Backend issues JWT token via Sanctum
5. Frontend stores token and grants access

### 6.2 Transaction Creation Flow

1. User submits transaction data
2. Frontend sends authenticated request
3. Backend validates token and permissions
4. Transaction is stored in the database
5. Account balance is updated
6. Updated data is returned to frontend

---

## 7. Security Considerations

* All API communication occurs over HTTPS
* Passwords are securely hashed
* JWT tokens are required for protected routes
* Role-based authorization prevents unauthorized access

---

## 8. Scalability and Extensibility

The architecture supports future enhancements, including:

* Additional financial modules
* Extended reporting capabilities
* Integration with external services

---

## 9. Conclusion

The Accounting Service architecture ensures a clear separation of concerns, secure data handling, and scalability. This design fulfills the functional and non-functional requirements defined in the Product Requirements Document and is suitable for both academic evaluation and real-world application development.
