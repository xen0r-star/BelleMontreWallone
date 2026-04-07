<?php

declare(strict_types=1);

namespace App\Utils;

use JsonException;


class JwtToken {
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string|bool {
        $padding = 4 - (strlen($data) % 4);
        if ($padding && $padding !== 4) {
            $data .= str_repeat('=', $padding);
        }

        return base64_decode(strtr($data, '-_', '+/'));
    }

    public static function encode(array $payload, string $secret): string {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];

        try {
            $header_encoded = self::base64UrlEncode((string) json_encode($header, JSON_THROW_ON_ERROR));
            $payload_encoded = self::base64UrlEncode((string) json_encode($payload, JSON_THROW_ON_ERROR));
            
        } catch (JsonException) {
            return '';
        }

        $signature = hash_hmac('sha256', $header_encoded . '.' . $payload_encoded, $secret, true);
        $signature_encoded = self::base64UrlEncode($signature);

        return $header_encoded . '.' . $payload_encoded . '.' . $signature_encoded;
    }

    public static function decode(string $token, string $secret): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header_encoded, $payload_encoded, $signature_encoded] = $parts;

        $expected_signature = hash_hmac('sha256', $header_encoded . '.' . $payload_encoded, $secret, true);
        $expected_signature_encoded = self::base64UrlEncode($expected_signature);

        if (!hash_equals($expected_signature_encoded, $signature_encoded)) return null;

        $payload_json = self::base64UrlDecode($payload_encoded);
        if ($payload_json === false) return null;

        try {
            $payload = json_decode($payload_json, true, 512, JSON_THROW_ON_ERROR);

        } catch (JsonException) {
            return null;
        }

        if (!is_array($payload)) return null;

        if (isset($payload['exp']) && is_int($payload['exp'])) {
            if (time() > $payload['exp']) return null;
        }

        return $payload;
    }
}
