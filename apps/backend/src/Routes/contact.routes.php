<?php

declare(strict_types=1);

namespace App\Routes;

use App\Core\Response;


function contact(): void {
    Response::json([
        'success' => true,
    ]);
    return;
}
