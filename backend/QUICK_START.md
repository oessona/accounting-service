# 🚀 Quick Start Guide - Backend

## Option 1: Using Docker (Easiest - Recommended)

### Prerequisites
- Docker Desktop installed and running on your computer

### Steps:

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Create a `.env` file** (if it doesn't exist):
   - Copy the template below or I'll create it for you

3. **Start everything with Docker:**
   ```bash
   docker-compose up -d
   ```
   This will:
   - Build the PHP container
   - Start PostgreSQL database
   - Start Nginx web server
   - Everything runs in containers (no need to install PHP/PostgreSQL locally!)

4. **Run database migrations:**
   ```bash
   docker-compose exec app php artisan migrate
   ```

5. **Your API is now running at:**
   - **http://localhost:8090**
   - API endpoints: **http://localhost:8090/api/...**

### Useful Docker Commands:
- **Stop everything:** `docker-compose down`
- **View logs:** `docker-compose logs -f`
- **Run commands in the app container:** `docker-compose exec app php artisan [command]`
- **Restart:** `docker-compose restart`

---

## Option 2: Run Locally (Without Docker)

### Prerequisites
- PHP 8.2+ installed
- Composer installed
- PostgreSQL installed and running

### Steps:

1. **Install PHP dependencies:**
   ```bash
   composer install
   ```

2. **Create `.env` file** with database credentials

3. **Generate app key:**
   ```bash
   php artisan key:generate
   ```

4. **Run migrations:**
   ```bash
   php artisan migrate
   ```

5. **Start the server:**
   ```bash
   php artisan serve
   ```
   - Server runs at: **http://localhost:8000**

---

## 🐛 Troubleshooting

- **Port 8090 already in use?** Change it in `docker-compose.yml` (line 21)
- **Database connection errors?** Check your `.env` file matches Docker settings
- **Permission errors?** Run: `docker-compose exec app chmod -R 775 storage bootstrap/cache`

