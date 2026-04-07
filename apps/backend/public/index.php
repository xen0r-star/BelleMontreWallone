<?php

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
ini_set('log_errors', '1');

use App\Core\Database;
use App\Core\Response;
use function App\Utils\configureCors;
use function App\Routes\dispatch;

require __DIR__ . '/../src/Core/Response.php';
require __DIR__ . '/../src/Core/Database.php';
require __DIR__ . '/../src/Utils/cors.php';
require __DIR__ . '/../src/Utils/json.php';
require __DIR__ . '/../src/Utils/jwtToken.php';

require __DIR__ . '/../src/Routes/auth.routes.php';
require __DIR__ . '/../src/Routes/admin.routes.php';
require __DIR__ . '/../src/Routes/contact.routes.php';
require __DIR__ . '/../src/Routes/reservation.routes.php';
require __DIR__ . '/../src/Routes/watches.routes.php';
require __DIR__ . '/../src/Routes/routes.php';



try {
    $config = require __DIR__ . '/../src/Config/config.php';

} catch (\Throwable) {
    Response::json([
        'error' => 'INTERNAL_SERVER_ERROR',
        'message' => 'An internal server error occurred',
    ], 500);
    exit;
}



// Security CORS configuration
configureCors((string) $config['cors_allowed_origins']);
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}



Database::connection();
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'); // Type: GET, POST, PUT, DELETE, PATCH, OPTIONS
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/'; // Path: /api/watches, /api/watches/{id}

dispatch($method, $path);