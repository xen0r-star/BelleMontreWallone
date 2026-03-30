<?php

declare(strict_types=1);

namespace App\Utils;

use App\Core\Response;
use PDO;


function dispatch(PDO $db, array $config, string $method, string $path): void {
    Response::json([
        'success' => false,
        'error' => 'route_not_found',
        'message' => 'Endpoint not found.',
    ], 404);
}
