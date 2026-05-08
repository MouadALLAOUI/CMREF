<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for representant/depot.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Depot',
    'heading' => 'Depot',
    'greeting' => 'Bienvenue',
    'description' => 'Displays depot quantities and status for books or representative stock. Source template: representant/depot.html.',
    'summary' => [],
    'filters' => [],
    'form' => [],
    'table' => [
        'title' => 'Depot',
        'sql' => 'SELECT livre, quantite, date_depot, statut FROM depots ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'livre' => 'Livre',
            'quantite' => 'Quantité',
            'date_depot' => 'Date',
            'statut' => 'Statut'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
