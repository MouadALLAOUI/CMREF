<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for representant/Robot.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Robot',
    'heading' => 'Robot',
    'greeting' => 'Bienvenue',
    'description' => 'Lists Robot visit/delivery records and provides the fields used to add a new visit. Source template: representant/Robot.html.',
    'summary' => [],
    'filters' => [],
    'form' => [
        'title' => 'Ajouter une livraison Robot',
        'action' => 'save_robot_visit.php',
        'fields' => [
            [
                'name' => 'date_visite',
                'label' => 'Date',
                'type' => 'date'
            ],
            [
                'name' => 'ville',
                'label' => 'Ville',
                'type' => 'text'
            ],
            [
                'name' => 'etablissement',
                'label' => 'Établissement',
                'type' => 'text'
            ],
            [
                'name' => 'contact',
                'label' => 'Contact',
                'type' => 'text'
            ]
        ],
        'submit' => 'Enregistrer'
    ],
    'table' => [
        'title' => 'Robot',
        'sql' => 'SELECT date_visite, ville, etablissement, contact, statut FROM robot_visits ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'date_visite' => 'Date',
            'ville' => 'Ville',
            'etablissement' => 'Établissement',
            'contact' => 'Contact',
            'statut' => 'Statut'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
