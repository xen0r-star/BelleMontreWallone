<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Response;


function dispatch(string $method, string $path): void {
    $routes = [
        'GET' => [
            '/api/health'             => fn() => Response::json(['success' => true, 'message' => 'API is healthy.']),
            
            '/api/watches'            => fn() => getWatches(),
            '/api/watches/filter'     => fn() => listSortValuesWatches(),
            '#/api/watches/([^/]+)#'  => fn($id) => getWatchById($id),

            '/api/auth/me'            => fn() => getCurrentUser(),

            '/api/admin/reservations' => fn() => getAdminReservations(),
        ],
        'POST' => [
            '/api/reservations'  => fn() => createReservation(),

            '/api/auth/login'    => fn() => login(),
            '/api/auth/logout'    => fn() => logout(),
            '/api/auth/register' => fn() => register(),
            '/api/auth/refresh'  => fn() => refresh(),

            '/api/admin/watches' => fn() => createAdminWatch(),
            '/api/contact'       => fn() => contact(),
        ],
        'PUT' => [
            '#/api/admin/watches/([^/]+)#' => fn($id) => updateAdminWatch($id),
        ],
        'DELETE' => [
            '#/api/admin/watches/([^/]+)#' => fn($id) => deleteAdminWatch($id),
        ],
    ];



    if (!isset($routes[$method])) {
        sendNotFound();
        return;
    }

    foreach ($routes[$method] as $routePattern => $handler) {
        if ($path === $routePattern) {
            $handler();
            return;
        }

        if (str_starts_with($routePattern, '#')) {
            if (preg_match($routePattern, $path, $matches)) {
                $handler($matches[1]);
                return;
            }
        }
    }

    sendNotFound();
}



function sendNotFound(): void {
    Response::json([
        'error' => 'ROUTE_NOT_FOUND',
        'message' => 'Endpoint not found',
    ], 404);
}
