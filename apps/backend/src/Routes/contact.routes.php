<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Response;
use App\Core\Database;
use function App\Utils\readJsonBody;
use function App\Utils\readRequiredString;

use PDOException;


function contact(): void {
    $data = readJsonBody(8192);
    if ($data === null) return;

    $errors = [];

    $surname = readRequiredString($data, 'surname', $errors, 100);
    $name = readRequiredString($data, 'name', $errors, 100);
    $email = readRequiredString($data, 'email', $errors, 255);
    $tel = readRequiredString($data, 'tel', $errors, 20);
    $message = readRequiredString($data, 'message', $errors, 2000);

    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid contact payload',
            'details' => $errors,
        ], 422);
        return;
    }

    if (!filter_var((string) $email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid email format';
    }

    if (!preg_match('/^\+?[0-9 .()\-]{7,20}$/', (string) $tel)) {
        $errors['tel'] = 'Invalid phone number format';
    }

    if (containsHeaderInjection((string) $surname) || containsHeaderInjection((string) $name) || containsHeaderInjection((string) $email)) {
        $errors['payload'] = 'Header injection attempt detected';
    }

    if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', (string) $message) === 1) {
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
        $statement->execute([
            'surname' => (string) $surname,
            'name' => (string) $name,
            'email' => (string) $email,
            'tel' => (string) $tel,
            'message' => (string) $message,
        ]);

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

function containsHeaderInjection(string $value): bool {
    return preg_match('/[\r\n]/', $value) === 1;
}