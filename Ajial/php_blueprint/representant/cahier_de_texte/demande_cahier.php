<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for representant/cahier de texte/demande_cahier.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Demande Cahier',
    'heading' => 'Demande Cahier',
    'greeting' => 'Bienvenue',
    'description' => 'Lists cahier de texte requests and totals by type. Source template: representant/cahier de texte/demande_cahier.html.',
    'summary' => [],
    'filters' => [],
    'form' => [
        'title' => 'Demander un cahier',
        'action' => 'save_cahier.php',
        'fields' => [
            [
                'name' => 'type_cahier',
                'label' => 'Type',
                'type' => 'text'
            ],
            [
                'name' => 'quantite',
                'label' => 'Quantité',
                'type' => 'number'
            ]
        ],
        'submit' => 'Demander'
    ],
    'table' => [
        'title' => 'Demande Cahier',
        'sql' => 'SELECT representant, type_cahier, quantite, statut FROM cahier_commandes ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'representant' => 'Représentant',
            'type_cahier' => 'Type',
            'quantite' => 'Quantité',
            'statut' => 'Statut'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
