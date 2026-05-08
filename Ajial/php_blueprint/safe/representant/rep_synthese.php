<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/representant/rep-synthese.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Rep Synthese',
    'heading' => 'Rep Synthese',
    'greeting' => 'Bienvenue',
    'description' => 'Displays aggregated synthesis totals using grouped SQL queries for the static summary table. Source template: safe/representant/rep-synthese.html.',
    'summary' => [
        [
            'label' => 'Total lignes',
            'sql' => 'SELECT COUNT(*) AS value FROM representants',
            'value_key' => 'value'
        ]
    ],
    'filters' => [],
    'form' => [
        'title' => 'Ajouter un représentant',
        'action' => 'save_representant.php',
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
        'title' => 'Rep Synthese',
        'sql' => 'SELECT nom, ville, telephone, email FROM representants ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'nom' => 'Représentant',
            'ville' => 'Ville',
            'telephone' => 'Téléphone',
            'email' => 'Email'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
