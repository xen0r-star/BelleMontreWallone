<?php

declare(strict_types=1);

namespace App\Utils;

use App\Core\Response;
use JsonException;

function readJsonBody(int $maxBytes = 65536): ?array {
    $rawBody = (string) file_get_contents('php://input');

    if ($rawBody === '') {
        Response::json([
            'error' => 'EMPTY_BODY',
            'message' => 'Request body cannot be empty',
        ], 400);
        return null;
    }

    if (strlen($rawBody) > $maxBytes) {
        Response::json([
            'error' => 'PAYLOAD_TOO_LARGE',
            'message' => 'JSON payload exceeds allowed size',
        ], 413);
        return null;
    }

    try {
        $decoded = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);
        
    } catch (JsonException) {
        Response::json([
            'error' => 'INVALID_JSON',
            'message' => 'Invalid JSON payload',
        ], 400);
        return null;
    }

    if (!is_array($decoded)) {
        Response::json([
            'error' => 'INVALID_JSON',
            'message' => 'Invalid JSON payload',
        ], 400);
        return null;
    }

    return $decoded;
}