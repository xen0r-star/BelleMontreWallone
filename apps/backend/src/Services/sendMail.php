<?php

declare(strict_types=1);

namespace App\Services;

function welcomeEmail(string $to): void {
    $subject = 'Bienvenue - Belle Montre Wallonne';
    $from = (string) (getenv('SMTP_FROM') ?: 'noreply@bellemontrewallone.store');
    $smtpHost = (string) (getenv('SMTP_HOST') ?: 'postfix');
    $smtpPort = (int) (getenv('SMTP_PORT') ?: 25);

    $templatePath = dirname(__DIR__) . '/Resources/newsletter-welcome-email.html';
    $templateBody = file_get_contents($templatePath);

    if ($templateBody === false) {
        throw new \RuntimeException('Unable to load welcome email template.');
    }

    $command =
        'swaks --to ' . escapeshellarg($to) . ' ' .
        '--from ' . escapeshellarg($from) . ' ' .
        '--server ' . escapeshellarg($smtpHost . ':' . (string) $smtpPort) . ' ' .
        '--header ' . escapeshellarg('Subject: ' . $subject) . ' ' .
        '--add-header ' . escapeshellarg('Content-Type: text/html; charset=UTF-8') . ' ' .
        '--body ' . escapeshellarg($templateBody) . ' ' .
        '--timeout 15';

    $output = [];
    $returnCode = 0;

    exec($command . ' 2>&1', $output, $returnCode);

    if ($returnCode !== 0) {
        $debugOutput = implode(' | ', array_slice($output, 0, 5));
        throw new \RuntimeException('SMTP send failed. ' . $debugOutput);
    }
}
?>