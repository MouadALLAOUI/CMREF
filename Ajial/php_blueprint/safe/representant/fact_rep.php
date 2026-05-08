<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/representant/fact-rep.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Fact Rep',
    'heading' => 'Fact Rep',
    'greeting' => 'Bienvenue',
    'description' => 'Lists invoices and invoice totals for the selected company or representative. Source template: safe/representant/fact-rep.html.',
    'summary' => [],
    'filters' => [],
    'form' => [
        'title' => 'Créer une facture',
        'action' => 'save_facture.php',
        'fields' => [
            [
                'name' => 'numero',
                'label' => 'N° facture',
                'type' => 'text'
            ],
            [
                'name' => 'date_facture',
                'label' => 'Date',
                'type' => 'date'
            ],
            [
                'name' => 'client',
                'label' => 'Client',
                'type' => 'text'
            ]
        ],
        'submit' => 'Créer'
    ],
    'table' => [
        'title' => 'Fact Rep',
        'sql' => 'SELECT numero, date_facture, client, total_ttc, statut FROM factures ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'numero' => 'N° facture',
            'date_facture' => 'Date',
            'client' => 'Client',
            'total_ttc' => 'Total TTC',
            'statut' => 'Statut'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
