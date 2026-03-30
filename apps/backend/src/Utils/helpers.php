<?php

declare(strict_types=1);

namespace App\Utils;

use App\Core\Response;
use JsonException;

function configureCors(string $allowedOriginsConfig): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $allowedOriginsConfig))));

    if ($allowedOrigins === []) {
        $allowedOrigins = ['*'];
    }

    if (in_array('*', $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: *');

    } elseif ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-API-KEY');
    header('Vary: Origin');
}


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