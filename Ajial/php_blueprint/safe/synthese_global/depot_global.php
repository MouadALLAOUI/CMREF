<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Synthèse Global/depot_global.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Depot Global',
    'heading' => 'Depot Global',
    'greeting' => 'Bienvenue',
    'description' => 'Displays aggregated synthesis totals using grouped SQL queries for the static summary table. Source template: safe/Synthèse Global/depot_global.html.',
    'summary' => [
        [
            'label' => 'Total lignes',
            'sql' => 'SELECT COUNT(*) AS value FROM depots',
            'value_key' => 'value'
        ]
    ],
    'filters' => [],
    'form' => [],
    'table' => [
        'title' => 'Depot Global',
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
