<?php

declare(strict_types=1);

$requireEnv = static function (string $key): string {
    $value = getenv($key);

    if ($value === false || trim($value) === '') {
        throw new \RuntimeException('Missing required environment variable: ' . $key);
    }

    return $value;
};

return [
    'app_env' => $requireEnv('APP_ENV'),
    'db_host' => $requireEnv('DB_HOST'),
    'db_port' => $requireEnv('DB_PORT'),
    'db_name' => $requireEnv('DB_NAME'),
    'db_user' => $requireEnv('DB_USER'),
    'db_password' => $requireEnv('DB_PASSWORD'),
    'cors_allowed_origins' => $requireEnv('CORS_ALLOWED_ORIGINS'),
    'admin_user' => $requireEnv('ADMIN_USER'),
    'admin_password' => $requireEnv('ADMIN_PASSWORD'),
    'admin_api_key' => $requireEnv('ADMIN_API_KEY'),
    'jwt_secret' => $requireEnv('JWT_SECRET'),
    'access_token_expires' => 900,
    'refresh_token_expires' => 604800,
];
