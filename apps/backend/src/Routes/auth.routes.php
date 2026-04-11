<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Database;
use App\Core\Response;
use App\Utils\JwtToken;
use App\Utils\Validation;
use function App\Utils\readJsonBody;
use function App\Utils\getAuthToken;
use function App\Utils\normalizeDateOfBirth;
use PDOException;


function login(): void {
    $data = readJsonBody(4096);
    if ($data === null) return;

    $errors = [];
    $userName = Validation::String($data, 'userName', $errors, 50);
    $password = Validation::String($data, 'password', $errors, 255);

    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid login payload',
            'details' => $errors,
        ], 422);
        return;
    }


    $db = Database::connection();

    try {
        $statement = $db->prepare('SELECT userId, userName, mail, hashPassWord, isAdmin FROM user WHERE userName = :userName OR mail = :userName LIMIT 1');
        if ($statement === false) {
            throw new PDOException('Unable to prepare login statement');
        }

        $statement->execute(['userName' => $userName]);
        $user = $statement->fetch();

        if (!$user || !verifyPassword((string) $password, (string) $user['hashPassWord'])) {
            Response::json([
                'error' => 'INVALID_CREDENTIALS',
                'message' => 'Invalid credentials',
            ], 401);
            return;
        }

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return;
    }

    $config = require __DIR__ . '/../Config/config.php';
    $accessToken = generateAccessToken($user, $config);
    $refreshTokenRecord = generateAndStoreRefreshToken($db, (int) $user['userId'], $config);
    if (!$refreshTokenRecord) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'Unable to generate refresh token',
        ], 500);
        return;
    }

    Response::json([
        'success' => true,
        'user' => [
            'id' => (int) $user['userId'],
            'userName' => (string) $user['userName'],
            'mail' => (string) $user['mail'],
            'isAdmin' => (bool) $user['isAdmin'],
        ],
        'accessToken' => $accessToken,
        'refreshToken' => $refreshTokenRecord,
    ]);
    return;
}


function register(): void {
    $data = readJsonBody(8192);
    if ($data === null) return;

    $errors = [];
    $userName =    Validation::String($data, 'userName', $errors, 50);
    $email =       Validation::String($data, 'email', $errors, 90);
    $password =    Validation::String($data, 'password', $errors, 255);
    $dateOfBirth = Validation::String($data, 'dateOfBirth', $errors, 10);

    if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid email format';
    }

    $normalizedDateOfBirth = normalizeDateOfBirth($dateOfBirth);
    if ($dateOfBirth !== null && $normalizedDateOfBirth === null) {
        $errors['dateOfBirth'] = 'Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY';
    }

    if ($password !== null && strlen($password) < 8) {
        $errors['password'] = 'Password must contain at least 8 characters';
    }

    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid registration payload',
            'details' => $errors,
        ], 422);
        return;
    }


    $db = Database::connection();

    try {
        $existsStatement = $db->prepare('SELECT userId FROM user WHERE userName = :userName OR mail = :mail LIMIT 1');
        if ($existsStatement === false) {
            throw new PDOException('Unable to prepare user existence statement');
        }

        $existsStatement->execute([
            'userName' => $userName,
            'mail' => $email,
        ]);

        if ($existsStatement->fetch()) {
            Response::json([
                'error' => 'USER_ALREADY_EXISTS',
                'message' => 'Username or email already used',
            ], 409);
            return;
        }

        $passwordHash = password_hash((string) $password, PASSWORD_BCRYPT, ['cost' => 13]);
        if ($passwordHash === false) {
            Response::json([
                'error' => 'INTERNAL_SERVER_ERROR',
                'message' => 'An internal server error occurred',
            ], 500);
            return;
        }

        $insertStatement = $db->prepare('INSERT INTO user(userName, mail, dateOfBirth, hashPassWord, isAdmin) VALUES (:userName, :mail, :dateOfBirth, :hashPassWord, 0)');
        if ($insertStatement === false) {
            throw new PDOException('Unable to prepare register statement');
        }

        $insertStatement->execute([
            'userName' => $userName,
            'mail' => $email,
            'dateOfBirth' => $normalizedDateOfBirth,
            'hashPassWord' => $passwordHash,
        ]);

        $newUserId = (int) $db->lastInsertId();

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return;
    }

    $config = require __DIR__ . '/../Config/config.php';
    $accessToken = generateAccessToken([
        'userId' => $newUserId,
        'userName' => $userName,
        'mail' => $email,
        'isAdmin' => false,
    ], $config);

    $refreshTokenRecord = generateAndStoreRefreshToken($db, $newUserId, $config);
    if (!$refreshTokenRecord) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'Unable to generate refresh token',
        ], 500);
        return;
    }

    Response::json([
        'success' => true,
        'user' => [
            'id' => $newUserId,
            'userName' => (string) $userName,
            'mail' => (string) $email,
            'dateOfBirth' => (string) $normalizedDateOfBirth,
            'isAdmin' => false,
        ],
        'accessToken' => $accessToken,
        'refreshToken' => $refreshTokenRecord,
    ], 201);
    return;
}


function refresh(): void {
    $data = readJsonBody(2048);
    if ($data === null) return;

    if (!array_key_exists('refreshToken', $data) || !is_string($data['refreshToken'])) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Refresh token is required',
        ], 400);
        return;
    }

    $refreshToken = trim($data['refreshToken']);
    if ($refreshToken === '') {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Refresh token cannot be empty',
        ], 400);
        return;
    }

    
    $config = require __DIR__ . '/../Config/config.php';
    $db = Database::connection();

    try {
        $statement = $db->prepare('SELECT userId, token, expiresAt, revokedAt FROM refresh_token WHERE token = :token LIMIT 1');
        if ($statement === false) {
            throw new PDOException('Unable to prepare token lookup statement');
        }

        $statement->execute(['token' => $refreshToken]);
        $tokenRecord = $statement->fetch();

        if (!$tokenRecord) {
            Response::json([
                'error' => 'INVALID_TOKEN',
                'message' => 'Invalid refresh token',
            ], 401);
            return;
        }

        if ($tokenRecord['revokedAt'] !== null) {
            Response::json([
                'error' => 'REVOKED_TOKEN',
                'message' => 'Refresh token has been revoked',
            ], 401);
            return;
        }

        $expiresAt = strtotime($tokenRecord['expiresAt']);
        if ($expiresAt === false || $expiresAt < time()) {
            Response::json([
                'error' => 'EXPIRED_TOKEN',
                'message' => 'Refresh token has expired',
            ], 401);
            return;
        }

        $userStatement = $db->prepare('SELECT userId, userName, mail, isAdmin FROM user WHERE userId = :userId LIMIT 1');
        if ($userStatement === false) {
            throw new PDOException('Unable to prepare user lookup statement');
        }

        $userStatement->execute(['userId' => (int) $tokenRecord['userId']]);
        $user = $userStatement->fetch();

        if (!$user) {
            Response::json([
                'error' => 'USER_NOT_FOUND',
                'message' => 'User not found',
            ], 404);
            return;
        }

        $newAccessToken = generateAccessToken($user, $config);

        Response::json([
            'success' => true,
            'accessToken' => $newAccessToken,
        ]);
        return;

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return;
    }
}


function getCurrentUser(): void {
    $token = getAuthToken();
    if ($token === null) return;


    $db = Database::connection();

    try {
        $statement = $db->prepare('SELECT userId, userName, mail, isAdmin FROM user WHERE userId = :userId LIMIT 1');
        if ($statement === false) {
            throw new PDOException('Unable to prepare user lookup statement');
        }

        $statement->execute(['userId' => (int) $token['sub']]);
        $user = $statement->fetch();

        if (!$user) {
            Response::json([
                'error' => 'USER_NOT_FOUND',
                'message' => 'User not found',
            ], 404);
            return;
        }

        Response::json([
            'success' => true,
            'user' => [
                'id' => (int) $user['userId'],
                'userName' => (string) $user['userName'],
                'mail' => (string) $user['mail'],
                'isAdmin' => (bool) $user['isAdmin'],
            ],
        ]);
        return;

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return;
    }
}





function verifyPassword(string $plainPassword, string $storedHash): bool {
    if (password_verify($plainPassword, $storedHash)) {
        return true;
    }

    return hash_equals($storedHash, $plainPassword);
}

function generateAccessToken(array $user, array $config): string {
    $payload = [
        'iss' => 'api',
        'sub' => (int) $user['userId'],
        'userName' => (string) $user['userName'],
        'mail' => (string) $user['mail'],
        'isAdmin' => (bool) ($user['isAdmin'] ?? false),
        'iat' => time(),
        'exp' => time() + (int) $config['access_token_expires'],
    ];

    return JwtToken::encode($payload, (string) $config['jwt_secret']);
}

function generateAndStoreRefreshToken(object $db, int $userId, array $config): ?string {
    $tokenValue = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + (int) $config['refresh_token_expires']);

    try {
        $statement = $db->prepare('INSERT INTO refreshToken(userId, token, expiresAt) VALUES (:userId, :token, :expiresAt)');
        if ($statement === false) {
            return null;
        }

        $statement->execute([
            'userId' => $userId,
            'token' => $tokenValue,
            'expiresAt' => $expiresAt,
        ]);

        return $tokenValue;
        
    } catch (PDOException) {
        return null;
    }
}
