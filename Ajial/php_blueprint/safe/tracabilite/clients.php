<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Traçabilité/Clients.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Clients',
    'heading' => 'Clients',
    'greeting' => 'Bienvenue',
    'description' => 'Lists client records and client traceability information. Source template: safe/Traçabilité/Clients.html.',
    'summary' => [],
    'filters' => [],
    'form' => [
        'title' => 'Ajouter un client',
        'action' => 'save_client.php',
        'fields' => [
            [
                'name' => 'nom',
                'label' => 'Nom',
                'type' => 'text'
            ],
            [
                'name' => 'ville',
                'label' => 'Ville',
                'type' => 'text'
            ],
            [
                'name' => 'telephone',
                'label' => 'Téléphone',
                'type' => 'text'
            ]
        ],
        'submit' => 'Ajouter'
    ],
    'table' => [
        'title' => 'Clients',
        'sql' => 'SELECT nom, ville, telephone, email FROM clients ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'nom' => 'Client',
            'ville' => 'Ville',
            'telephone' => 'Téléphone',
            'email' => 'Email'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
