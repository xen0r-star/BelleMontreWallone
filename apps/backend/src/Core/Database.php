<?php

declare(strict_types=1);

namespace App\Core;

use PDO;
use PDOException;


final class Database {
    private static ?PDO $connection = null;

    public static function connection(): PDO {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }


        $configPath = __DIR__ . '/../Config/config.php';
        
        if (!file_exists($configPath)) {
            self::sendError();
        }

        $config = require $configPath;



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
            self::sendError();
            exit;
        }

        return self::$connection;
    }

    
    private static function sendError(): void {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        exit;
    }
}
