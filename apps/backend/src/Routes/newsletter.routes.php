<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Response;
use App\Core\Database;
use function App\Utils\readJsonBody;
use function App\Services\welcomeEmail;
use App\Utils\Validation;

use PDOException;


function subscribeNewsletter(): void {
    $data = readJsonBody(8192);
    if ($data === null) return;

    $errors = [];

    $email =   Validation::String($data, 'email', $errors, 255);

    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid newsletter payload',
            'details' => $errors,
        ], 422);
        return;
    }

    if (!filter_var((string) $email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid email format';
    }


    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid newsletter payload',
            'details' => $errors,
        ], 422);
        return;
    }


    $db = Database::connection();

    try {
        $statement = $db->prepare('SELECT newsletterId FROM newsletter WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        if ($statement->fetch()) {
            Response::json([
                'error' => 'ALREADY_SUBSCRIBED',
                'message' => 'This email is already subscribed to the newsletter',
            ], 409);
            return;
        }

        $statement = $db->prepare('INSERT INTO newsletter(email) VALUES (:email)');
        $statement->execute([
            'email' => (string) $email
        ]);

    } catch (PDOException) {
        Response::json([
            'error' => 'DATABASE_ERROR',
            'message' => 'An error occurred while processing your request',
        ], 500);
        return;
    }


    try {
        welcomeEmail((string) $email);
    } catch (\Throwable $exception) {
        error_log('Newsletter email send failed: ' . $exception->getMessage());
    }

    Response::json([
        'success' => true,
        'message' => 'Newsletter subscription received successfully',
    ]);
}