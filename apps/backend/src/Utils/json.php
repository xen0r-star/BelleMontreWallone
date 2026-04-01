<?php

declare(strict_types=1);

namespace App\Utils;

use App\Core\Response;
use JsonException;

function readJsonBody(): ?array {
    $rawBody = (string) file_get_contents('php://input');

    try {
        $decoded = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);
        
    } catch (JsonException) {
        Response::json([
            'success' => false,
            'error' => 'invalid_json',
            'message' => 'Invalid JSON payload.',
        ], 400);
        return null;
    }

    if (!is_array($decoded)) {
        Response::json([
            'success' => false,
            'error' => 'invalid_json',
            'message' => 'Invalid JSON payload.',
        ], 400);
        return null;
    }

    return $decoded;
}