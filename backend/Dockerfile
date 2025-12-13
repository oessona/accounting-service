# Используем официальный PHP-FPM образ
FROM php:8.2-fpm

# Установка системных зависимостей и библиотек для расширений
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка PHP-расширений
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Установка Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Установка рабочей директории
WORKDIR /var/www

# Копирование проекта в контейнер
COPY . .

# Установка PHP-зависимостей проекта через Composer
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Настройка прав для Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
