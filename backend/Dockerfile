# Utiliser l'image PHP officielle avec Apache
FROM php:8.4-apache

# 1. Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libpq-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_pgsql bcmath

# 2. Configurer Apache (Activer mod_rewrite pour Laravel)
RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 3. Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Copier le code de l'application
WORKDIR /var/www/html
COPY . .

# 5. Installer les dépendances PHP
RUN composer install --no-dev --optimize-autoloader

# 6. Donner les bonnes permissions pour le stockage Laravel
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# 7. Exposer le port par défaut de Render
EXPOSE 80

# 8. Commande de démarrage (migrations et optimisations Laravel incluses)
CMD php artisan migrate --force && php artisan db:seed --force && php artisan config:cache && php artisan route:cache && php artisan view:cache && apache2-foreground
