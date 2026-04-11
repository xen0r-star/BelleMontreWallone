<?php

declare(strict_types=1);

namespace App\Utils;

function normalizeDateOfBirth(?string $value): ?string {
    if ($value === null) return null;

    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) === 1) {
        return $value;
    }

    if (preg_match('/^(\d{2})-(\d{2})-(\d{4})$/', $value, $matches) === 1) {
        return sprintf('%s-%s-%s', $matches[3], $matches[2], $matches[1]);
    }

    return null;
}