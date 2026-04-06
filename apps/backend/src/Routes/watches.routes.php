<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Database;
use App\Core\Response;
use PDOException;


function getWatches(): void {
    $db = Database::connection();
    $PER_PAGE = 20;

    $pageValue = $_GET['page'] ?? '1';
    if (!is_numeric($pageValue) || (int) $pageValue < 1) {
        Response::json([
            'error' => 'INVALID_PAGE',
            'message' => 'Query param page must be an integer greater than or equal to 1',
        ], 400);
        return;
    }

    $page = (int) $pageValue;
    $offset = ($page - 1) * $PER_PAGE;

    try {
        $countStatement = $db->query('SELECT COUNT(*) AS total FROM watch');
        $total = $countStatement !== false ? (int) $countStatement->fetchColumn() : 0;

        $statement = $db->prepare('SELECT * FROM watch ORDER BY watchId ASC LIMIT :limit OFFSET :offset');
        if ($statement === false) {
            throw new PDOException('Unable to prepare watches query');
        }

        $statement->bindValue(':limit', $PER_PAGE, \PDO::PARAM_INT);
        $statement->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $statement->execute();

        $watches = $statement->fetchAll();

    } catch (PDOException) {
        Response::json([
            'error' => 'NO_RESULTS_FOUND',
            'message' => 'No results found',
        ], 500);
        return;
    }

    Response::json([
        'data' => $watches,
        'pagination' => [
            'page' => $page,
            'perPage' => $PER_PAGE,
            'total' => $total,
            'totalPages' => $PER_PAGE > 0 ? (int) ceil($total / $PER_PAGE) : 0,
        ],
    ]);
    return;
}



function getWatchById(string $id): void {
    $db = Database::connection();

    try {
        $statement = $db->prepare('SELECT * FROM watch WHERE watchId = :id');
        $statement->execute(['id' => $id]);
        $watch = $statement->fetch();

        if (!$watch) {
            Response::json([
                'error' => 'NO_RESULTS_FOUND',
                'message' => 'No results found for the given ID',
            ], 404);
            return;
        }

    } catch (PDOException) {
        Response::json([
            'error' => 'NO_RESULTS_FOUND',
            'message' => 'No results found for the given ID',
        ], 500);
        return;
    }

    Response::json([
        'data' => $watch
    ]);
}