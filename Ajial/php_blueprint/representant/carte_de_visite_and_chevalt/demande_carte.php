<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for representant/carte de visite & chevalt/demande_carte.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Demande Carte',
    'heading' => 'Demande Carte',
    'greeting' => 'Bienvenue',
    'description' => 'Lists business card and chevalet orders with their current status. Source template: representant/carte de visite & chevalt/demande_carte.html.',
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
        'title' => 'Demande Carte',
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
