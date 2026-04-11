<?php

declare(strict_types=1);

namespace App\Utils;

use App\Core\Database;
use App\Core\Response;
use App\Utils\JwtToken;
use PDOException;


function getAuthToken(bool $isAdmin = false): ?array {
    $authHeader = $_SERVER['HTTP_X_API_KEY'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
        Response::json([
            'error' => 'UNAUTHORIZED',
            'message' => 'Missing or invalid access token',
        ], 401);
        return null;
    }

    
    $config = require __DIR__ . '/../Config/config.php';
    $token = JwtToken::decode($matches[1], (string) $config['jwt_secret']);

    if ($token === null) {
        Response::json([
            'error' => 'UNAUTHORIZED',
            'message' => 'Missing or invalid access token',
        ], 401);
        return null;
    }

    if (!array_key_exists('sub', $token) || !array_key_exists('userName', $token) || !array_key_exists('mail', $token)) {
        Response::json([
            'error' => 'UNAUTHORIZED',
            'message' => 'Missing or invalid access token',
        ], 401);
        return null;
    }


    $db = Database::connection();

    try {
        $statement = $db->prepare("
            SELECT userId, userName, mail, isAdmin 
            FROM user 
            WHERE userId = :userId AND userName = :userName AND mail = :mail 
            LIMIT 1
        ");
        if ($statement === false) {
            throw new PDOException('Unable to prepare admin token validation statement');
        }

        $statement->execute([
            'userId' => (int) $token['sub'],
            'userName' => (string) $token['userName'],
            'mail' => (string) $token['mail'],
        ]);
        
        $user = $statement->fetch();
        if (!$user) {
            Response::json([
                'error' => 'UNAUTHORIZED',
                'message' => 'Missing or invalid access token',
            ], 401);
            return null;
        }

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return null;
    }


    if ($isAdmin && !(bool) $user['isAdmin']) {
        Response::json([
            'error' => 'FORBIDDEN',
            'message' => 'You do not have permission to access this resource',
        ], 403);
        return null;
    }


    return [
        'userId' => (int) $user['userId'],
        'userName' => (string) $user['userName'],
        'mail' => (string) $user['mail'],
        'isAdmin' => (bool) $user['isAdmin'],
    ];
}
