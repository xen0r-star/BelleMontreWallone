<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Database;
use App\Core\Response;


function getWatches(): void {
    $db = Database::connection();
    $statement = $db->query('SELECT * FROM watches');

    $watches = $statement !== false ? $statement->fetchAll() : [];

    Response::json([
        'success' => true,
        'data' => $watches
    ]);

    return;
}


function getWatchById(string $id): void {
    Response::json([
        'success' => true,
        'data' => [
            'id' => "royal-oak-automatique",
            'brand' => "Audemars Piguet",
            'model' => "Royal Oak Automatique",
            'category' => "Chronographe",
            'material' => "Acier",
            'price' => 25500,
            'movement' => "Mecanique automatique",
            'caliber' => "3120",
            'case' => "Acier 41mm",
            'reserve' => "60 heures",
            'waterResistance' => "50 metres",
            'description' => "Un classique moderne aux lignes architecturales, pense pour traverser les epoques avec elegance.",
            'images' => [
                "https://images.unsplash.com/photo-1523170335258-f5c6c6bdcf94?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=1200&q=80",
            ],
        ]
    ]);
    return;
}