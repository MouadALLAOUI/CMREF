<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for representant/Accueil.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Accueil représentant',
    'heading' => 'Accueil représentant',
    'greeting' => 'Bienvenue',
    'description' => 'Displays dashboard metrics and recent operational activity for the authenticated user. Source template: representant/Accueil.html.',
    'summary' => [
        [
            'label' => 'Livraisons du jour',
            'sql' => 'SELECT COUNT(*) AS value FROM bons_livraison WHERE date_livraison = :today',
            'value_key' => 'value'
        ],
        [
            'label' => 'Remboursements',
            'sql' => 'SELECT COUNT(*) AS value FROM remboursements WHERE DATE(created_at) = :today',
            'value_key' => 'value'
        ]
    ],
    'filters' => [],
    'form' => [],
    'table' => [
        'title' => 'Accueil représentant',
        'sql' => 'SELECT numero, date_livraison, type, statut FROM dashboard_events ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'numero' => 'N°',
            'date_livraison' => 'Date',
            'type' => 'Type',
            'statut' => 'Statut'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
