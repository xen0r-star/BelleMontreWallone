<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Response;


function login(): void {
    Response::json([
        'success' => true,
    ]);
    return;
}


function register(): void {
    Response::json([
        'success' => true,
    ]);
    return;
}


function getCurrentUser(): void {
    Response::json([
        'success' => true,
    ]);
    return;
}


function logout(): void {
    Response::json([
        'success' => true,
    ]);
    return;
}
