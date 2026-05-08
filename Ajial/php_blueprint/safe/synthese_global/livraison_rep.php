<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Synthèse Global/Livraison Rep.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Livraison Rep',
    'heading' => 'Livraison Rep',
    'greeting' => 'Bienvenue',
    'description' => 'Displays aggregated synthesis totals using grouped SQL queries for the static summary table. Source template: safe/Synthèse Global/Livraison Rep.html.',
    'summary' => [
        [
            'label' => 'Total lignes',
            'sql' => 'SELECT COUNT(*) AS value FROM bons_livraison',
            'value_key' => 'value'
        ]
    ],
    'filters' => [],
    'form' => [
        'title' => 'Créer un BL',
        'action' => 'save_bl.php',
        'fields' => [
            [
                'name' => 'numero',
                'label' => 'N° BL',
                'type' => 'text'
            ],
            [
                'name' => 'date_livraison',
                'label' => 'Date',
                'type' => 'date'
            ],
            [
                'name' => 'type',
                'label' => 'Type',
                'type' => 'text'
            ]
        ],
        'submit' => 'Créer'
    ],
    'table' => [
        'title' => 'Livraison Rep',
        'sql' => 'SELECT numero, date_livraison, type, statut FROM bons_livraison ORDER BY 1 DESC LIMIT 100',
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
