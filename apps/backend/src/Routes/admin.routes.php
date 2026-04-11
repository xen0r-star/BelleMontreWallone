<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Database;
use App\Core\Response;
use App\Utils\Validation;
use function App\Utils\readJsonBody;
use function App\Utils\getAuthToken;
use PDOException;


function getAdminReservations(): void {
    $token = getAuthToken(true);
    if ($token === null) return;


    $db = Database::connection();

    try {
        $statement = $db->prepare("
            SELECT l.userId, l.watchId, l.loanDate AS reservationDate, 
                   l.returnLoanDate AS returnDate, l.isOutDelay, u.userName, 
                   u.mail, w.brand, w.model 
            FROM loan l 
            INNER JOIN user u ON u.userId = l.userId 
            INNER JOIN watch w ON w.watchId = l.watchId 
            ORDER BY l.loanDate DESC, l.returnLoanDate DESC
        ");

        if ($statement === false) {
            throw new PDOException('Unable to prepare admin reservations statement');
        }

        $statement->execute();
        $reservations = $statement->fetchAll();

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return;
    }

    Response::json([
        'data' => $reservations,
    ]);
    return;
}


function createAdminWatch(): void {
    $token = getAuthToken(true);
    if ($token === null) return;


    $data = readJsonBody(16384);
    if ($data === null) return;

    $errors = [];
    $idShelf =         Validation::String($data, 'idShelf', $errors, 255);
    $model =           Validation::String($data, 'model', $errors, 255);
    $watchCollection = Validation::String($data, 'watchCollection', $errors, 255);
    $imageUrl =        Validation::String($data, 'imageUrl', $errors, 255);

    $brand =           Validation::String($data, 'brand', $errors, 255, true);
    $watchDesc =       Validation::String($data, 'watchDesc', $errors, 255, true);
    $retailPrice =     Validation::Numeric($data, 'retailPrice', $errors, true);
    $marketPrice =     Validation::Numeric($data, 'marketPrice', $errors, true);
    $isInProduction =  Validation::Boolean($data, 'isInProduction', $errors, true);
    $movement =        Validation::String($data, 'movement', $errors, 255, true);
    $diameter =        Validation::Numeric($data, 'diameter', $errors, true);
    $materials =       Validation::String($data, 'materials', $errors, 255, true);
    $watertightness =  Validation::String($data, 'watertightness', $errors, 50, true);
    $isActif =         Validation::Boolean($data, 'isActif', $errors, true);

    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid watch payload',
            'details' => $errors,
        ], 422);
        return;
    }

    
    $db = Database::connection();

    try {
        $shelfExistsStatement = $db->prepare('SELECT idShelf FROM shelf WHERE idShelf = :idShelf LIMIT 1');
        if ($shelfExistsStatement === false) {
            throw new PDOException('Unable to prepare shelf existence statement');
        }

        $shelfExistsStatement->execute(['idShelf' => $idShelf]);
        if (!$shelfExistsStatement->fetch()) {
            Response::json([
                'error' => 'INVALID_SHELF',
                'message' => 'The given shelf does not exist',
            ], 422);
            return;
        }


        $statement = $db->prepare("
            INSERT INTO watch(
                idShelf, brand, model, watchDesc, watchCollection, 
                imageUrl, retailPrice, marketPrice, isInProduction, 
                movement, diameter, materials, watertightness, isActif
            ) VALUES (
                :idShelf, :brand, :model, :watchDesc, :watchCollection, 
                :imageUrl, :retailPrice, :marketPrice, :isInProduction, 
                :movement, :diameter, :materials, :watertightness, :isActif
            )
        ");

        if ($statement === false) {
            throw new PDOException('Unable to prepare admin watch insert statement');
        }

        $statement->execute([
            'idShelf' => $idShelf,
            'brand' => $brand,
            'model' => $model,
            'watchDesc' => $watchDesc,
            'watchCollection' => $watchCollection,
            'imageUrl' => $imageUrl,
            'retailPrice' => $retailPrice,
            'marketPrice' => $marketPrice,
            'isInProduction' => $isInProduction === null ? "DEFAULT" : $isInProduction,
            'movement' => $movement,
            'diameter' => $diameter,
            'materials' => $materials,
            'watertightness' => $watertightness,
            'isActif' => $isActif === null ? "DEFAULT" : $isActif,
        ]);


        $createdWatchId = (int) $db->lastInsertId();
        $selectStatement = $db->prepare('SELECT * FROM watch WHERE watchId = :watchId LIMIT 1');
        if ($selectStatement === false) {
            throw new PDOException('Unable to prepare inserted watch lookup statement');
        }

        $selectStatement->execute(['watchId' => $createdWatchId]);
        $watch = $selectStatement->fetch();

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return;
    }

    Response::json([
        'success' => true,
        'data' => $watch,
    ], 201);
    return;
}


function updateAdminWatch(string $id): void {
    $token = getAuthToken(true);
    if ($token === null) return;


    $data = readJsonBody(16384);
    if ($data === null) return;

    $errors = [];
    $setClauses = [];
    $params = ['watchId' => $id];
    
    $idShelf = Validation::String($data, 'idShelf', $errors, 12, true);
    if ($idShelf !== null) {
        $setClauses[] = 'idShelf = :idShelf';
        $params['idShelf'] = $idShelf;
    }

    $brand = Validation::String($data, 'brand', $errors, 255, true);
    if ($brand !== null) {
        $setClauses[] = 'brand = :brand';
        $params['brand'] = $brand;
    }

    $model = Validation::String($data, 'model', $errors, 255, true);
    if ($model !== null) {
        $setClauses[] = 'model = :model';
        $params['model'] = $model;
    }

    $watchDesc = Validation::String($data, 'watchDesc', $errors, 255, false);
    if ($watchDesc !== null) {
        $setClauses[] = 'watchDesc = :watchDesc';
        $params['watchDesc'] = $watchDesc;
    }

    $watchCollection = Validation::String($data, 'watchCollection', $errors, 255, true);
    if ($watchCollection !== null) {
        $setClauses[] = 'watchCollection = :watchCollection';
        $params['watchCollection'] = $watchCollection;
    }

    $imageUrl = Validation::String($data, 'imageUrl', $errors, 255, true);
    if ($imageUrl !== null) {
        $setClauses[] = 'imageUrl = :imageUrl';
        $params['imageUrl'] = $imageUrl;
    }

    $retailPrice = Validation::Numeric($data, 'retailPrice', $errors, true);
    if ($retailPrice !== null) {
        $setClauses[] = 'retailPrice = :retailPrice';
        $params['retailPrice'] = $retailPrice;
    }

    $marketPrice = Validation::Numeric($data, 'marketPrice', $errors, true);
    if ($marketPrice !== null) {
        $setClauses[] = 'marketPrice = :marketPrice';
        $params['marketPrice'] = $marketPrice;
    }

    $isInProduction = Validation::Boolean($data, 'isInProduction', $errors, true);
    if ($isInProduction !== null) {
        $setClauses[] = 'isInProduction = :isInProduction';
        $params['isInProduction'] = $isInProduction;
    }

    $movement = Validation::String($data, 'movement', $errors, 255, true);
    if ($movement !== null) {
        $setClauses[] = 'movement = :movement';
        $params['movement'] = $movement;
    }

    $diameter = Validation::Numeric($data, 'diameter', $errors, true);
    if ($diameter !== null) {
        $setClauses[] = 'diameter = :diameter';
        $params['diameter'] = $diameter;
    }

    $materials = Validation::String($data, 'materials', $errors, 255, true);
    if ($materials !== null) {
        $setClauses[] = 'materials = :materials';
        $params['materials'] = $materials;
    }

    $watertightness = Validation::String($data, 'watertightness', $errors, 50, true);
    if ($watertightness !== null) {
        $setClauses[] = 'watertightness = :watertightness';
        $params['watertightness'] = $watertightness;
    }

    $isActif = Validation::Boolean($data, 'isActif', $errors, true);
    if ($isActif !== null) {
        $setClauses[] = 'isActif = :isActif';
        $params['isActif'] = $isActif;
    }


    if (!empty($errors)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'Invalid watch payload',
            'details' => $errors,
        ], 422);
        return;
    }

    if (empty($setClauses)) {
        Response::json([
            'error' => 'VALIDATION_ERROR',
            'message' => 'No updatable field provided',
        ], 400);
        return;
    }



    $db = Database::connection();

    try {
        $existsStatement = $db->prepare('SELECT watchId FROM watch WHERE watchId = :watchId LIMIT 1');
        if ($existsStatement === false) {
            throw new PDOException('Unable to prepare watch existence statement');
        }

        $existsStatement->execute(['watchId' => $id]);
        if (!$existsStatement->fetch()) {
            Response::json([
                'error' => 'NO_RESULTS_FOUND',
                'message' => 'No watch found for the given ID',
            ], 404);
            return;
        }

        if (array_key_exists('idShelf', $params)) {
            $shelfExistsStatement = $db->prepare('SELECT idShelf FROM shelf WHERE idShelf = :idShelf LIMIT 1');
            if ($shelfExistsStatement === false) {
                throw new PDOException('Unable to prepare shelf existence statement');
            }

            $shelfExistsStatement->execute(['idShelf' => $params['idShelf']]);
            if (!$shelfExistsStatement->fetch()) {
                Response::json([
                    'error' => 'INVALID_SHELF',
                    'message' => 'The given shelf does not exist',
                ], 422);
                return;
            }
        }

        $updateSql = 'UPDATE watch SET ' . implode(', ', $setClauses) . ' WHERE watchId = :watchId';
        $updateStatement = $db->prepare($updateSql);
        if ($updateStatement === false) {
            throw new PDOException('Unable to prepare admin watch update statement');
        }

        $updateStatement->execute($params);


        $selectStatement = $db->prepare('SELECT * FROM watch WHERE watchId = :watchId LIMIT 1');
        if ($selectStatement === false) {
            throw new PDOException('Unable to prepare updated watch lookup statement');
        }

        $selectStatement->execute(['watchId' => $id]);
        $watch = $selectStatement->fetch();

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return;
    }

    Response::json([
        'success' => true,
        'data' => $watch,
    ]);
    return;
}


function deleteAdminWatch(string $id): void {
    $token = getAuthToken(true);
    if ($token === null) return;


    $db = Database::connection();

    try {
        $existsStatement = $db->prepare('SELECT watchId FROM watch WHERE watchId = :watchId LIMIT 1');
        if ($existsStatement === false) {
            throw new PDOException('Unable to prepare watch existence statement');
        }

        $existsStatement->execute(['watchId' => $id]);
        if (!$existsStatement->fetch()) {
            Response::json([
                'error' => 'NO_RESULTS_FOUND',
                'message' => 'No watch found for the given ID',
            ], 404);
            return;
        }

        $deleteStatement = $db->prepare('UPDATE watch SET isActif = 0 WHERE watchId = :watchId');
        if ($deleteStatement === false) {
            throw new PDOException('Unable to prepare watch delete statement');
        }

        $deleteStatement->execute(['watchId' => $id]);

    } catch (PDOException) {
        Response::json([
            'error' => 'INTERNAL_SERVER_ERROR',
            'message' => 'An internal server error occurred',
        ], 500);
        return;
    }

    Response::json([
        'success' => true,
    ]);
    return;
}
