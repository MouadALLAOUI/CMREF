<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Emailing/emailing.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Emailing',
    'heading' => 'Emailing',
    'greeting' => 'Bienvenue',
    'description' => 'Shows outbound emailing or invitation messages and their delivery status. Source template: safe/Emailing/emailing.html.',
    'summary' => [],
    'filters' => [],
    'form' => [
        'title' => 'Composer un message',
        'action' => 'send_email.php',
        'fields' => [
            [
                'name' => 'destinataire',
                'label' => 'Destinataire',
                'type' => 'email'
            ],
            [
                'name' => 'sujet',
                'label' => 'Sujet',
                'type' => 'text'
            ]
        ],
        'submit' => 'Envoyer'
    ],
    'table' => [
        'title' => 'Emailing',
        'sql' => 'SELECT destinataire, sujet, date_envoi, statut FROM email_logs ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'destinataire' => 'Destinataire',
            'sujet' => 'Sujet',
            'date_envoi' => 'Date',
            'statut' => 'Statut'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
