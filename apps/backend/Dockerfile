FROM php:8.2-apache

RUN docker-php-ext-install pdo_mysql
RUN a2enmod rewrite headers
RUN apt-get update && apt-get install -y swaks

COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf
COPY . /var/www/html

WORKDIR /var/www/html

EXPOSE 80
