<?php

declare(strict_types=1);

namespace App\Utils;

use App\Core\Database;
use App\Core\Response;
use App\Utils\JwtToken;
use PDOException;


function getAuthToken(bool $isAdmin = false): ?array {
    // Reprendre une partie du commit `https://github.com/xen0r-star/BelleMontreWallone/tree/d9601e9742dda54fd492d56e700d2c78bab35890` si besoin de refaire l'auth avec le bearer
    $authHeader = $_COOKIE['access_token'] ?? '';
    if (!$authHeader) {
        Response::json([
            'authentification' => 'UNAUTHORIZED',
            'message' => 'Missing or invalid access token',
        ], 200);
        return null;
    }

    
    $config = require __DIR__ . '/../Config/config.php';
    $token = JwtToken::decode($authHeader, (string) $config['jwt_secret']);

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
