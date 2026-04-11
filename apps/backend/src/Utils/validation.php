<?php

declare(strict_types=1);

namespace App\Utils;


final class Validation {
    public static function String(array $data, string $field, array &$errors, int $maxLength, bool $isOptional = false): ?string {
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

        if (strlen($value) > $maxLength) {
            $errors[$field] = 'Maximum length exceeded';
            return null;
        }

        return $value;
    }


    public static function Numeric(array $data, string $field, array &$errors, bool $isOptional = false): ?float {
        if (!array_key_exists($field, $data)) {
            if ($isOptional) {
                return null;
            }

            $errors[$field] = 'Field is required';
            return null;
        }

        if ($data[$field] === null || $data[$field] === '') {
            return null;
        }

        if (!is_numeric($data[$field])) {
            $errors[$field] = 'Field must be numeric';
            return null;
        }

        return (float) $data[$field];
    }


    public static function Boolean(array $data, string $field, array &$errors, bool $isOptional = false): ?int {
        if (!array_key_exists($field, $data)) {
            if ($isOptional) {
                return null;
            }

            $errors[$field] = 'Field is required';
            return null;
        }

        if (!is_bool($data[$field])) {
            $errors[$field] = 'Field must be a boolean';
            return null;
        }

        return $data[$field] ? 1 : 0;
    }
}
