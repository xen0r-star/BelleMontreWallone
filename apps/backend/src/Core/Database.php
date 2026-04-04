<?php

declare(strict_types=1);

namespace App\Core;

use PDO;
use PDOException;


final class Database {
    private static ?PDO $connection = null;

    public static function connection(): PDO {
        try {
            $config = require __DIR__ . '/../Config/config.php';

        } catch (\Throwable) {
            Response::json([
                'success' => false,
                'error' => 'internal_server_error',
            ], 500);
            exit;
        }



        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $config['db_host'],
            $config['db_port'],
            $config['db_name']
        );

        try {
            self::$connection = new PDO(
                $dsn,
                $config['db_user'],
                $config['db_password'],
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );

        } catch (PDOException) {
            Response::json([
                'success' => false,
                'error' => 'database_connection_failed',
                'message' => 'Unable to connect to database.',
            ], 500);
            exit;
        }

        return self::$connection;
    }
}
