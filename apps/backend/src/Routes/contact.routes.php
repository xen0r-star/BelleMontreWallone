<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Response;
use App\Core\Database;
use function App\Utils\readJsonBody;

use PDOException;


function contact(): void {
    $data = readJsonBody(8192);
    if ($data === null) {
        return;
    }


    $requiredFields = ['surname', 'name', 'email', 'tel', 'message'];
    $errors = [];

    foreach ($requiredFields as $field) {
        if (!array_key_exists($field, $data)) {
            $errors[$field] = 'Field is required';
            continue;
        }

        if (!is_string($data[$field])) {
            $errors[$field] = 'Field must be a string';
            continue;
        }

        $data[$field] = trim($data[$field]);
        if ($data[$field] === '') {
            $errors[$field] = 'Field cannot be empty';
        }
    }

    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid contact payload',
            'details' => $errors,
        ], 422);
        return;
    }

    validateMaxLength($data['surname'], 100, 'surname', $errors);
    validateMaxLength($data['name'], 100, 'name', $errors);
    validateMaxLength($data['email'], 255, 'email', $errors);
    validateMaxLength($data['tel'], 20, 'tel', $errors);
    validateMaxLength($data['message'], 2000, 'message', $errors);

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid email format';
    }

    if (!preg_match('/^\+?[0-9 .()\-]{7,20}$/', $data['tel'])) {
        $errors['tel'] = 'Invalid phone number format';
    }

    if (containsHeaderInjection($data['surname']) || containsHeaderInjection($data['name']) || containsHeaderInjection($data['email'])) {
        $errors['payload'] = 'Header injection attempt detected';
    }

    if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $data['message']) === 1) {
        $errors['message'] = 'Message contains invalid control characters';
    }


    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid contact payload',
            'details' => $errors,
        ], 422);
        return;
    }


    $db = Database::connection();

    try {
        $statement = $db->prepare('INSERT INTO contact(surname, name, email, tel, message) VALUES (:surname, :name, :email, :tel, :message)');
        $statement->execute($data);

    } catch (PDOException) {
        Response::json([
            'error' => 'DATABASE_ERROR',
            'message' => 'An error occurred while processing your request',
        ], 500);
        return;
    }


    Response::json([
        'success' => true,
        'message' => 'Contact request received successfully',
    ]);
}



function validateMaxLength(string $value, int $max, string $field, array &$errors): void {
    if (safeStringLength($value) > $max) {
        $errors[$field] = 'Maximum length exceeded';
    }
}

function safeStringLength(string $value): int {
    if (function_exists('mb_strlen')) {
        return mb_strlen($value);
    }

    return strlen($value);
}

function containsHeaderInjection(string $value): bool {
    return preg_match('/[\r\n]/', $value) === 1;
}