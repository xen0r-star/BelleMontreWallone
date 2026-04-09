<?php

declare(strict_types=1);

namespace App\Utils;

function readRequiredString(array $data, string $field, array &$errors, int $maxLength, bool $isOptional = false): ?string {
    if (!array_key_exists($field, $data)) {
        if ($isOptional) {
            return null;
        }
        
        $errors[$field] = 'Field is required';
        return null;
    }

    if (!is_string($data[$field])) {
        $errors[$field] = 'Field must be a string';
        return null;
    }

    $value = trim($data[$field]);
    if ($value === '') {
        $errors[$field] = 'Field cannot be empty';
        return null;
    }

    if (safeStringLength($value) > $maxLength) {
        $errors[$field] = 'Maximum length exceeded';
        return null;
    }

    return $value;
}

function safeStringLength(string $value): int {
    if (function_exists('mb_strlen')) {
        return mb_strlen($value);
    }

    return strlen($value);
}
