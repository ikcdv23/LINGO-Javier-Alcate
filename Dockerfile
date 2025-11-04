FROM php:8.2-apache

# Dependencias
RUN apt-get update && apt-get install -y \
    git unzip zip libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    libonig-dev libzip-dev libxml2-dev && \
    docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# Habilitar mod_rewrite
RUN a2enmod rewrite

WORKDIR /var/www/html

# Composer (copiado desde la imagen oficial)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar proyecto
COPY . .

# Instalar dependencias de Composer
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Config Apache para Laravel public/
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80
CMD ["apache2-foreground"]
