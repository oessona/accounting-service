# Accounting Services — Backend

This is the backend for the **Accounting Services** project, built with **Laravel** (PHP framework).  
It provides APIs for user authentication, account management, and admin features.

---

## 🚀 Tech Stack
- **Laravel 10+**
- **PHP 8.2+**
- **MySQL / PostgreSQL**
- **Laravel Sanctum** (for authentication)
- **Postman / cURL** for API testing

---

## 🧱 Database Structure

### Users Table
| Column | Type | Description |
|---------|------|-------------|
| id | bigint | Primary key |
| name | string | User’s full name |
| email | string | Unique email |
| password | string | Hashed password |
| role | enum('admin','user','manager','accountant') | Defines access level |
| created_at / updated_at | timestamps | Auto-managed |

### Accounts Table
| Column | Type | Description |
|---------|------|-------------|
| id | bigint | Primary key |
| user_id | foreignId | Relation to user |
| name | string | Account name |
| type | enum('personal','business','savings','investment') | Account type |
| balance | decimal | Current balance |
| created_at / updated_at | timestamps | Auto-managed |

---

## 🔐 Authentication

### Implemented Features
- **Register** new users  
- **Login** and receive a token  
- **Logout** (token revocation)  
- **Middleware protection** for authenticated routes

### Endpoints
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/register` | Create new account |
| POST | `/api/login` | Authenticate user |
| POST | `/api/logout` | Logout user (requires token) |

---

## 🧾 Account Management

### Implemented in `AccountController`

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/accounts` | Admin → all accounts<br>User → only own |
| POST | `/api/accounts` | Create new account (authenticated) |
| PUT | `/api/accounts/{id}` | Update account (owner or admin only) |
| DELETE | `/api/accounts/{id}` | Delete account (owner or admin only) |

### Role Logic
- **Admins** can view, edit, and delete all accounts.  
- **Users** can only manage their own accounts.  
- Authorization handled via `isAdmin()` method in the `User` model.

---

## 🧩 User Model

```php
public function isAdmin()
{
    return $this->role === 'admin';
}
```
## 🧰 How to Run Locally
```
1️⃣ Install dependencies
composer install
2️⃣ Copy and configure .env
cp .env.example .env
Then edit .env to set your database credentials.
3️⃣ Generate application key
php artisan key:generate
4️⃣ Run migrations
php artisan migrate
5️⃣ Start local development server
php artisan serve
```
