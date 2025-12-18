# Product Requirements Document (PRD)

## 1. Product Overview

### Product Name

**Accounting Service**

### Product Goal

The goal of the Accounting Service is to provide a secure, user-friendly web application that allows users to manage personal financial data, track income and expenses, and view summarized financial reports. The system aims to help users better understand and control their financial activity through structured accounts, categorized transactions, and visual reports.

This product is developed as a **university project** and demonstrates modern full-stack development practices, secure authentication, and role-based access control.

---

## 2. Problem Statement

Many individuals track their finances manually using spreadsheets or notes, which is time-consuming, error-prone, and lacks real-time insights. Existing accounting tools are often overly complex or not tailored for basic personal finance needs.

The Accounting Service addresses this problem by providing:

* Centralized financial data management
* Clear separation of accounts and transactions
* Real-time balance calculation
* Simple and intuitive reporting

---

## 3. Target Audience

* Students managing personal expenses
* Individuals who want basic personal accounting
* Users who need a simple alternative to spreadsheets
* Academic evaluators reviewing full-stack web applications

---

## 4. User Roles

### 4.1 Regular User

* Registers and logs into the system
* Creates and manages financial accounts
* Records income and expense transactions
* Views financial reports and dashboards

### 4.2 Admin

* Manages users
* Has access to administrative panels
* Can view user data for system maintenance purposes

---

## 5. Core User Scenarios

1. A user registers an account and logs into the system.
2. A user creates one or more financial accounts (e.g., cash, bank account).
3. A user adds income and expense transactions linked to specific accounts.
4. The system automatically updates account balances.
5. A user views transaction history and financial reports.
6. An admin reviews user information through the admin panel.

---

## 6. Functional Requirements

### 6.1 User Management

* Users must be able to register using email and password.
* Users must be able to log in and log out securely.
* The system must support JWT-based authentication using Laravel Sanctum.
* Passwords must be securely hashed.
* The system must support role-based access control (admin and regular user).

### 6.2 Account Management

* Users must be able to create multiple accounts.
* Each account must have a type (e.g., cash, bank).
* The system must display real-time account balances.
* Accounts must be visually represented with type-specific icons.

### 6.3 Transaction Management

* Users must be able to record income and expense transactions.
* Transactions must be categorized (e.g., salary, groceries, utilities).
* Each transaction must have a status (processing, done, failed).
* Transactions must be linked to a specific account.
* Users must be able to edit and delete transactions.

### 6.4 Financial Reports

* The system must provide a dashboard with financial summaries.
* Users must be able to view reports based on transactions and accounts.

### 6.5 Admin Panel

* Admin users must be able to view and manage registered users.

---

## 7. Non-Functional Requirements

### 7.1 Performance

* The system must respond to API requests within acceptable time limits under normal load.

### 7.2 Security

* All sensitive data must be protected using authentication and authorization mechanisms.
* JWT tokens must be securely stored and validated.

### 7.3 Reliability

* The system must ensure data consistency for accounts and transactions.

### 7.4 Usability

* The user interface must be responsive and mobile-friendly.
* The application must use clear navigation and consistent UI components.

### 7.5 Scalability

* The backend architecture must support future feature expansion.

---

## 8. MVP Scope (Version 0.1)

The following features must be included in the MVP:

* User registration and login
* Account creation and balance tracking
* Transaction creation, editing, and deletion
* Transaction categorization
* Basic dashboard and reports
* Admin user management

---

## 9. Out-of-Scope Features

The following features are not included in version 0.1:

* Bank API integrations
* Multi-currency support
* Budget planning tools
* Exporting reports to PDF or Excel
* Notifications and alerts

---

## 10. Acceptance Criteria

### User Registration

* A user can successfully register with a valid email and password.
* Passwords are stored in hashed format.

### User Authentication

* A registered user can log in and receive a valid JWT token.
* Unauthorized users cannot access protected routes.

### Account Management

* A user can create, view, and manage multiple accounts.
* Account balances update correctly after each transaction.

### Transaction Management

* A user can add income and expense transactions.
* Transactions are correctly linked to accounts.
* Editing or deleting a transaction updates account balances.

### Financial Reports

* The dashboard displays accurate financial summaries based on stored data.

### Admin Panel

* Admin users can view and manage user accounts.
