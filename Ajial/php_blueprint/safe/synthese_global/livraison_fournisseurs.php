<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Synthèse Global/Livraison Fournisseurs.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Livraison Fournisseurs',
    'heading' => 'Livraison Fournisseurs',
    'greeting' => 'Bienvenue',
    'description' => 'Displays aggregated synthesis totals using grouped SQL queries for the static summary table. Source template: safe/Synthèse Global/Livraison Fournisseurs.html.',
    'summary' => [
        [
            'label' => 'Total lignes',
            'sql' => 'SELECT COUNT(*) AS value FROM fournisseurs',
            'value_key' => 'value'
        ]
    ],
    'filters' => [],
    'form' => [
        'title' => 'Ajouter un fournisseur',
        'action' => 'save_fournisseur.php',
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
        'title' => 'Livraison Fournisseurs',
        'sql' => 'SELECT nom, ville, telephone, email FROM fournisseurs ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'nom' => 'Fournisseur',
            'ville' => 'Ville',
            'telephone' => 'Téléphone',
            'email' => 'Email'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
