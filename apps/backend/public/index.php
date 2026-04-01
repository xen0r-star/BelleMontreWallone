<?php

declare(strict_types=1);

use App\Core\Database;
use App\Core\Response;
use Throwable;
use function App\Utils\configureCors;
use function App\Routes\dispatch;

require __DIR__ . '/../src/Core/Response.php';
require __DIR__ . '/../src/Core/Database.php';
require __DIR__ . '/../src/Utils/helpers.php';
require __DIR__ . '/../src/Utils/routes.php';



try {
    $config = require __DIR__ . '/../src/Config/config.php';

} catch (Throwable) {
    Response::json([
        'success' => false,
        'error' => 'internal_server_error',
    ], 500);
    exit;
}



// Security CORS configuration
configureCors((string) $config['cors_allowed_origins']);
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}



Database::connection($config);
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'); // Type: GET, POST, PUT, DELETE, PATCH, OPTIONS
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/'; // Path: /api/watches, /api/watches/{id}

dispatch($method, $path);