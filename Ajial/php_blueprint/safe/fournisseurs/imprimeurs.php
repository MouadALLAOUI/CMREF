<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Fournisseurs/imprimeurs.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Imprimeurs',
    'heading' => 'Imprimeurs',
    'greeting' => 'Bienvenue',
    'description' => 'Lists supplier/imprimeur records with contact details. Source template: safe/Fournisseurs/imprimeurs.html.',
    'summary' => [],
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
        'title' => 'Imprimeurs',
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
