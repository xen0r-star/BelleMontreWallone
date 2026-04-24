<?php

declare(strict_types=1);

namespace App\Services;

function welcomeEmail($to): void {
    $subject = "Bienvenue - Belle Montre Wallonne";
    $from = "noreply@bellemontrewallone.store";
    $template = "./Resources/newsletter-welcome-email.html";

    $command = "swaks --to " . escapeshellarg($to) . " " .
            "--from " . escapeshellarg($from) . " " .
            "--server postfix " .
            "--header " . escapeshellarg("Subject: $subject") . " " .
            "--body " . escapeshellarg($template) . " " .
            "--add-header 'Content-Type: text/html'";

    exec($command, $output, $return_var);

    if ($return_var === 0) {
        echo "Mail envoyé avec succès !";

    } else {
        echo "Erreur lors de l'envoi.";
        print_r($output);
    }
}
?>