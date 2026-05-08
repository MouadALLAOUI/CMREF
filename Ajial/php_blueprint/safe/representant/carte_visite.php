<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/representant/carte_visite.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Carte Visite',
    'heading' => 'Carte Visite',
    'greeting' => 'Bienvenue',
    'description' => 'Lists business card and chevalet orders with their current status. Source template: safe/representant/carte_visite.html.',
    'summary' => [],
    'filters' => [],
    'form' => [
        'title' => 'Demander une carte',
        'action' => 'save_carte.php',
        'fields' => [
            [
                'name' => 'modele',
                'label' => 'Modèle',
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
        'title' => 'Carte Visite',
        'sql' => 'SELECT representant, modele, date_demande, statut FROM carte_commandes ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'representant' => 'Représentant',
            'modele' => 'Modèle',
            'date_demande' => 'Date',
            'statut' => 'Statut'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
