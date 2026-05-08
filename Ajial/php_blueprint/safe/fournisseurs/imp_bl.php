<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Fournisseurs/imp-bl.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Imp Bl',
    'heading' => 'Imp Bl',
    'greeting' => 'Bienvenue',
    'description' => 'Lists supplier delivery notes sent to MSM-MEDIAS. Source template: safe/Fournisseurs/imp-bl.html.',
    'summary' => [],
    'filters' => [],
    'form' => [],
    'table' => [
        'title' => 'Imp Bl',
        'sql' => 'SELECT numero, date_livraison, type, statut FROM fournisseur_bons_livraison ORDER BY 1 DESC LIMIT 100',
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
