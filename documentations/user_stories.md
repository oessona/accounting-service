# User Stories — Accounting Service

## 1. Overview

This document describes the user stories for the **Accounting Service** project. The stories are written following Agile methodology and cover the main system users: **Regular User** and **Admin**. Each story includes clear and testable acceptance criteria.

---

## 2. User Role: Regular User

### US-1: User Registration

**As a** regular user,
**I want to** register an account using my email and password,
**So that** I can access the accounting system.

**Acceptance Criteria:**

* The system allows registration with a valid email and password.
* The email must be unique in the system.
* The password is stored in hashed form.
* After successful registration, the user can log in.

---

### US-2: User Login

**As a** regular user,
**I want to** log into the system,
**So that** I can access my personal financial data.

**Acceptance Criteria:**

* The system validates the email and password.
* A valid JWT token is issued upon successful login.
* Unauthorized users cannot access protected pages.

---

### US-3: Create Financial Account

**As a** regular user,
**I want to** create multiple financial accounts,
**So that** I can separate different sources of money.

**Acceptance Criteria:**

* The user can create an account with a name and type.
* The account appears in the account list after creation.
* The initial balance is set correctly.

---

### US-4: View Account Balances

**As a** regular user,
**I want to** view real-time balances of my accounts,
**So that** I can track my finances accurately.

**Acceptance Criteria:**

* Account balances are displayed correctly.
* Balances update automatically after transactions.

---

### US-5: Add Income Transaction

**As a** regular user,
**I want to** record income transactions,
**So that** my account balance increases correctly.

**Acceptance Criteria:**

* The user can enter income amount, category, and account.
* The transaction is saved successfully.
* The linked account balance increases accordingly.

---

### US-6: Add Expense Transaction

**As a** regular user,
**I want to** record expense transactions,
**So that** my account balance decreases correctly.

**Acceptance Criteria:**

* The user can enter expense amount, category, and account.
* The transaction is saved successfully.
* The linked account balance decreases accordingly.

---

### US-7: Edit Transaction

**As a** regular user,
**I want to** edit an existing transaction,
**So that** I can correct mistakes.

**Acceptance Criteria:**

* The user can update transaction details.
* Account balances are recalculated correctly after editing.

---

### US-8: Delete Transaction

**As a** regular user,
**I want to** delete a transaction,
**So that** incorrect data does not affect my reports.

**Acceptance Criteria:**

* The user can delete a transaction.
* The account balance updates correctly after deletion.

---

### US-9: View Financial Reports

**As a** regular user,
**I want to** view financial reports and summaries,
**So that** I can analyze my income and expenses.

**Acceptance Criteria:**

* The dashboard displays summarized financial data.
* Report data is consistent with stored transactions.

---

### US-10: Manage Profile Settings

**As a** regular user,
**I want to** manage my profile settings,
**So that** I can update my personal information securely.

**Acceptance Criteria:**

* The user can update profile information.
* Changes are saved successfully.

---

## 3. User Role: Admin

### US-11: View Users

**As an** admin,
**I want to** view all registered users,
**So that** I can manage the system effectively.

**Acceptance Criteria:**

* The admin can see a list of all users.
* User data is displayed correctly.

---

### US-12: Manage Users

**As an** admin,
**I want to** manage user accounts,
**So that** I can maintain system integrity.

**Acceptance Criteria:**

* The admin can update user roles.
* The admin can deactivate users if necessary.

---

## 4. MVP Coverage

The user stories US-1 to US-12 fully cover the MVP scope defined in the Product Requirements Document (PRD) and represent all essential system functionality for version 0.1 of the Accounting Service.
