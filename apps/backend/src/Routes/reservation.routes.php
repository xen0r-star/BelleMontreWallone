<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Database;
use App\Core\Response;
use function App\Utils\readJsonBody;
use function App\Utils\getAuthToken;
use function App\Utils\normalizeDateOfBirth;
use App\Utils\Validation;
use PDOException;


function createReservation(): void {
    $token = getAuthToken();
    if ($token === null) return;

    $data = readJsonBody(4096);
    if ($data === null) return;


    $errors = [];

    $watchId = Validation::Integer($data, 'watchId', $errors);
    $returnDateInput = Validation::String($data, 'returnDate', $errors, 10, true);
    $returnLoanDate = normalizeDateOfBirth($returnDateInput);

    $today = date('Y-m-d');
    if ($returnLoanDate !== null && $returnLoanDate < $today) {
        $errors['returnDate'] = 'returnLoanDate must be today or later';
    }

    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid reservation payload',
            'details' => $errors,
        ], 422);
        return;
    }


    $db = Database::connection();

    try {
        $watchStatement = $db->prepare('SELECT watchId FROM watch WHERE watchId = :watchId AND isActif = 1 LIMIT 1');
        if ($watchStatement === false) {
            throw new PDOException('Unable to prepare watch lookup statement');
        }

        $watchStatement->execute(['watchId' => $watchId]);
        if (!$watchStatement->fetch()) {
            Response::json([
                'error' => 'NO_RESULTS_FOUND',
                'message' => 'No active watch found for the given ID',
            ], 404);
            return;
        }


        $availabilityStatement = $db->prepare('SELECT userId FROM loan WHERE watchId = :watchId AND returnLoanDate >= CURRENT_DATE LIMIT 1');
        if ($availabilityStatement === false) {
            throw new PDOException('Unable to prepare watch availability statement');
        }

        $availabilityStatement->execute(['watchId' => $watchId]);
        if ($availabilityStatement->fetch()) {
            Response::json([
                'error' => 'WATCH_UNAVAILABLE',
                'message' => 'This watch is already reserved',
            ], 409);
            return;
        }


        $userReservationCountStatement = $db->prepare("
            SELECT user.isPremium, COUNT(loan.watchId) AS activeReservations
            FROM user
            LEFT JOIN loan USING (userId)
            WHERE userId = :userId AND loan.returnLoanDate >= CURRENT_DATE
            GROUP BY userId;
        ");
        if ($userReservationCountStatement === false) {
            throw new PDOException('Unable to prepare user reservation count statement');
        }

        $userReservationCountStatement->execute(['userId' => (int) $token['userId']]);
        $userReservationData = $userReservationCountStatement->fetch();

        $isPremium = $userReservationData['isPremium'] ?? 0;
        $activeReservations = $userReservationData['activeReservations'] ?? 0;

        if (!$isPremium && $activeReservations >= 1) {
            Response::json([
                'error' => 'RESERVATION_LIMIT_REACHED',
                'message' => 'Non-premium users can only have 1 active reservation',
            ], 403);
            return;

        } elseif ($isPremium && $activeReservations >= 5) {
            Response::json([
                'error' => 'RESERVATION_LIMIT_REACHED',
                'message' => 'Premium users can only have 5 active reservations',
            ], 403);
            return;
        }



        $insertStatement = $db->prepare('INSERT INTO loan(userId, watchId, loanDate, returnLoanDate) VALUES (:userId, :watchId, CURRENT_DATE, :returnLoanDate)');
        if ($insertStatement === false) {
            throw new PDOException('Unable to prepare reservation insert statement');
        }

        $insertStatement->execute([
            'userId' => (int) $token['userId'],
            'watchId' => $watchId,
            'returnLoanDate' => $returnLoanDate,
        ]);


        $reservationStatement = $db->prepare("
            SELECT userId, watchId, loanDate AS reservationDate, returnLoanDate AS returnDate 
            FROM loan 
            WHERE userId = :userId AND watchId = :watchId 
            LIMIT 1
        ");
        if ($reservationStatement === false) {
            throw new PDOException('Unable to prepare reservation lookup statement');
        }

        $reservationStatement->execute([
            'userId' => (int) $token['userId'],
            'watchId' => $watchId,
        ]);
        $reservation = $reservationStatement->fetch();


        $totalAllReservationsStatement = $db->prepare("
            SELECT COUNT(*) AS totalReservations FROM loan WHERE watchId = :watchId
        ");
        if ($totalAllReservationsStatement === false) {
            throw new PDOException('Unable to prepare total reservations count statement');
        }

        $totalAllReservationsStatement->execute(['watchId' => $watchId]);
        $totalReservationsData = $totalAllReservationsStatement->fetch();
        $totalAllReservations = $totalReservationsData['totalReservations'] ?? 0;

        if ($totalAllReservations >= 10) {
            $updateUserStatement = $db->prepare('UPDATE user SET isPremium = 1 WHERE userId = :userId');
            if ($updateUserStatement === false) {
                throw new PDOException('Unable to prepare user update statement');
            }

            $updateUserStatement->execute(['userId' => (int) $token['userId']]);

            Response::json([
                'success' => true,
                'premiumUpgrade' => true,
                'data' => $reservation,
            ], 201);
            return;

        } else {
            Response::json([
                'success' => true,
                'premiumUpgrade' => false,
                'data' => $reservation,
            ], 201);
            return;
        }

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return;
    }
}
