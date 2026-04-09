<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Database;
use App\Core\Response;
use PDO;
use PDOException;

const WATCHES_PER_PAGE = 20;


function getWatches(): void {
    $db = Database::connection();

    $pageValue = $_GET['page'] ?? '1';
    if (!is_numeric($pageValue) || (int) $pageValue < 1) {
        Response::json([
            'error' => 'INVALID_PAGE',
            'message' => 'Query param page must be an integer greater than or equal to 1',
        ], 400);
        return;
    }

    $page = (int) $pageValue;
    $offset = ($page - 1) * WATCHES_PER_PAGE;

    try {
        $movement = $_GET['movement'] ?? null;
        $materials = $_GET['materials'] ?? null;
        $diameter = $_GET['diameter'] ?? null;
        $brand = $_GET['brand'] ?? null;
        $minRetailPrice = $_GET['minRetailPrice'] ?? null;
        $maxRetailPrice = $_GET['maxRetailPrice'] ?? null;
        $minMarketPrice = $_GET['minPrice'] ?? null;
        $maxMarketPrice = $_GET['maxPrice'] ?? null;

        $where = [];
        $params = [];

        if ($movement !== null) {
            $where[] = 'movement = :movement';
            $params[':movement'] = $movement;
        }

        if ($materials !== null) {
            $where[] = 'materials = :materials';
            $params[':materials'] = $materials;
        }

        if ($diameter !== null) {
            $where[] = 'TRUNCATE(diameter, 0) = TRUNCATE(:diameter, 0)';
            $params[':diameter'] = $diameter;
        }

        if ($brand !== null) {
            $where[] = 'brand = :brand';
            $params[':brand'] = $brand;
        }

        if ($minRetailPrice !== null) {
            $where[] = 'retailPrice >= :minRetailPrice';
            $params[':minRetailPrice'] = $minRetailPrice;
        }

        if ($maxRetailPrice !== null) {
            $where[] = 'retailPrice <= :maxRetailPrice';
            $params[':maxRetailPrice'] = $maxRetailPrice;
        }

        if ($minMarketPrice !== null) {
            $where[] = 'marketPrice >= :minMarketPrice';
            $params[':minMarketPrice'] = $minMarketPrice;
        }

        if ($maxMarketPrice !== null) {
            $where[] = 'marketPrice <= :maxMarketPrice';
            $params[':maxMarketPrice'] = $maxMarketPrice;
        }

        $whereSql = '';

        if (!empty($where)) {
            $whereSql = 'WHERE ' . implode(' AND ', $where);
        }



        $countSql = "SELECT COUNT(*) FROM watch $whereSql";
        $countStatement = $db->prepare($countSql);

        foreach ($params as $key => $value) {
            $countStatement->bindValue($key, $value);
        }

        $countStatement->execute();
        $total = (int) $countStatement->fetchColumn();


        
        $sql = "SELECT * FROM watch $whereSql ORDER BY watchId ASC LIMIT :limit OFFSET :offset";
        $statement = $db->prepare($sql);

        foreach ($params as $key => $value) {
            $statement->bindValue($key, $value);
        }

        $statement->bindValue(':limit', WATCHES_PER_PAGE, PDO::PARAM_INT);
        $statement->bindValue(':offset', $offset, PDO::PARAM_INT);

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
            'perPage' => WATCHES_PER_PAGE,
            'total' => $total,
            'totalPages' => WATCHES_PER_PAGE > 0 ? (int) ceil($total / WATCHES_PER_PAGE) : 0,
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


function listSortValuesWatches(): void {
    $db = Database::connection();

    try {
        $movements = $db->query("
            SELECT movement 
            FROM watch 
            WHERE movement IS NOT NULL AND movement != ''
            GROUP BY movement
            ORDER BY movement ASC
        ")->fetchAll(PDO::FETCH_COLUMN);
        
        $materials = $db->query("
            SELECT materials
            FROM watch
            WHERE materials IS NOT NULL AND materials != ''
            GROUP BY materials
            ORDER BY materials ASC
        ")->fetchAll(PDO::FETCH_COLUMN);

        $diameters = $db->query("
            SELECT DISTINCT TRUNCATE(diameter, 0) AS diameter 
            FROM watch 
            WHERE diameter IS NOT NULL AND diameter != 0
            ORDER BY diameter ASC
        ")->fetchAll(PDO::FETCH_COLUMN);

        $brands = $db->query("
            SELECT brand 
            FROM watch 
            WHERE brand IS NOT NULL AND brand != ''
            GROUP BY brand
            ORDER BY brand ASC
        ")->fetchAll(PDO::FETCH_COLUMN);

        $minRetailPrice = $db->query('SELECT MIN(retailPrice) FROM watch')->fetchColumn();
        $maxRetailPrice = $db->query('SELECT MAX(retailPrice) FROM watch')->fetchColumn();
        $minMarketPrice = $db->query('SELECT MIN(marketPrice) FROM watch')->fetchColumn();
        $maxMarketPrice = $db->query('SELECT MAX(marketPrice) FROM watch')->fetchColumn();

    } catch (PDOException) {
        Response::json([
            'error' => 'NO_RESULTS_FOUND',
            'message' => 'No results found',
        ], 500);
        return;
    }

    Response::json([
        'movement' => $movements,
        'materials' => $materials,
        'diameter' => $diameters,
        'brand' => $brands,
        'minRetailPrice' => $minRetailPrice,
        'maxRetailPrice' => $maxRetailPrice,
        'minMarketPrice' => $minMarketPrice,
        'maxMarketPrice' => $maxMarketPrice,
    ]);
}