<?php

declare(strict_types=1);

namespace App\Utils;

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