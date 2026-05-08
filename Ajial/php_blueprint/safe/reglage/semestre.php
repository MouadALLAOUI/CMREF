<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Réglage/semestre.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Semestre',
    'heading' => 'Semestre',
    'greeting' => 'Bienvenue',
    'description' => 'Displays editable administration settings used by Ajial templates. Source template: safe/Réglage/semestre.html.',
    'summary' => [],
    'filters' => [],
    'form' => [
        'title' => 'Mettre à jour un paramètre',
        'action' => 'save_setting.php',
        'fields' => [
            [
                'name' => 'cle',
                'label' => 'Clé',
                'type' => 'text'
            ],
            [
                'name' => 'valeur',
                'label' => 'Valeur',
                'type' => 'text'
            ]
        ],
        'submit' => 'Enregistrer'
    ],
    'table' => [
        'title' => 'Semestre',
        'sql' => 'SELECT cle, valeur, updated_at FROM parametres ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'cle' => 'Clé',
            'valeur' => 'Valeur',
            'updated_at' => 'Mis à jour'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
