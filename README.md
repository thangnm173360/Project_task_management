<p align="center"><img src="https://laravel.com/assets/img/components/logo-laravel.svg"></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/d/total.svg" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/v/stable.svg" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License"></a>
</p>

## About Laravel


    Step 1: Clone GitHub repo for this project locally
    
    Step 2: cd into your project
    
    Step 3: $ composer install
    
    Step 4: $ npm install
    
    Step 5: copy file .env 
        $ cp .env.example .env
        edit file .env example
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=laravel_task_management
        DB_USERNAME=root
        DB_PASSWORD=
        
    Step 6: create DB with name is laravel_task_management
    Step 7: $ php artisan key:generate
    if you false when generate: 
    please visit link https://stackoverflow.com/questions/61177995/laravel-packagemanifest-php-undefined-index-name
    Step 8: $ php artisan migrate
    
    Step 9: $ php artisan serve