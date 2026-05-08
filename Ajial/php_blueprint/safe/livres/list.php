<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/livres/livres.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Livres',
    'heading' => 'Livres',
    'greeting' => 'Bienvenue',
    'description' => 'Lists books with category, level, page count, price, and stock information. Source template: safe/livres/livres.html.',
    'summary' => [],
    'filters' => [
        [
            'name' => 'categorie_id',
            'label' => 'Catégorie',
            'options_sql' => 'SELECT id, nom AS label FROM categories ORDER BY nom'
        ]
    ],
    'form' => [
        'title' => 'Ajouter un livre',
        'action' => 'save_livre.php',
        'fields' => [
            [
                'name' => 'titre',
                'label' => 'Titre',
                'type' => 'text'
            ],
            [
                'name' => 'niveau',
                'label' => 'Niveau',
                'type' => 'text'
            ],
            [
                'name' => 'prix',
                'label' => 'Prix',
                'type' => 'number'
            ]
        ],
        'submit' => 'Ajouter'
    ],
    'table' => [
        'title' => 'Livres',
        'sql' => 'SELECT titre, niveau, pages, prix, stock FROM livres ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'titre' => 'Titre',
            'niveau' => 'Niveau',
            'pages' => 'Pages',
            'prix' => 'Prix',
            'stock' => 'Stock'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
