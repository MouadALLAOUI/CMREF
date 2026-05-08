<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Synthèse Global/vente.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Vente',
    'heading' => 'Vente',
    'greeting' => 'Bienvenue',
    'description' => 'Displays aggregated synthesis totals using grouped SQL queries for the static summary table. Source template: safe/Synthèse Global/vente.html.',
    'summary' => [
        [
            'label' => 'Total lignes',
            'sql' => 'SELECT COUNT(*) AS value FROM audit_entries',
            'value_key' => 'value'
        ]
    ],
    'filters' => [],
    'form' => [],
    'table' => [
        'title' => 'Vente',
        'sql' => 'SELECT label, created_at, status FROM audit_entries ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'label' => 'Libellé',
            'created_at' => 'Date',
            'status' => 'Statut'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
