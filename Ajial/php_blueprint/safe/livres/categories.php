<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/livres/categories.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Categories',
    'heading' => 'Categories',
    'greeting' => 'Bienvenue',
    'description' => 'Lists and maintains book categories used throughout the catalogue. Source template: safe/livres/categories.html.',
    'summary' => [],
    'filters' => [],
    'form' => [
        'title' => 'Ajouter une catégorie',
        'action' => 'save_categorie.php',
        'fields' => [
            [
                'name' => 'nom',
                'label' => 'Nom',
                'type' => 'text'
            ],
            [
                'name' => 'description',
                'label' => 'Description',
                'type' => 'text'
            ]
        ],
        'submit' => 'Ajouter'
    ],
    'table' => [
        'title' => 'Categories',
        'sql' => 'SELECT nom, description, ordre FROM categories ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'nom' => 'Catégorie',
            'description' => 'Description',
            'ordre' => 'Ordre'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
