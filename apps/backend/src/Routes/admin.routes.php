<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Response;


function getAdminReservations(): void {
    Response::json([
        'success' => true,
    ]);
    return;
}


function getAdminWatches(): void {
    Response::json([
        'success' => true,
    ]);
    return;
}


function createAdminWatch(): void {
    Response::json([
        'success' => true,
    ]);
    return;
}


function updateAdminWatch(string $id): void {
    Response::json([
        'success' => true,
    ]);
    return;
}


function deleteAdminWatch(string $id): void {
    Response::json([
        'success' => true,
    ]);
    return;
}
