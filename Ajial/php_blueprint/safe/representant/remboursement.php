<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/representant/Remboursement.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Remboursement',
    'heading' => 'Remboursement',
    'greeting' => 'Bienvenue',
    'description' => 'Displays reimbursement rows, balances, and payment statuses. Source template: safe/representant/Remboursement.html.',
    'summary' => [
        [
            'label' => 'Total remboursé',
            'sql' => 'SELECT COALESCE(SUM(montant),0) AS value FROM remboursements',
            'value_key' => 'value'
        ]
    ],
    'filters' => [],
    'form' => [
        'title' => 'Ajouter un remboursement',
        'action' => 'save_remboursement.php',
        'fields' => [
            [
                'name' => 'date_remboursement',
                'label' => 'Date',
                'type' => 'date'
            ],
            [
                'name' => 'banque',
                'label' => 'Banque',
                'type' => 'text'
            ],
            [
                'name' => 'cheque_numero',
                'label' => 'N° chèque',
                'type' => 'text'
            ],
            [
                'name' => 'montant',
                'label' => 'Montant',
                'type' => 'number'
            ]
        ],
        'submit' => 'Ajouter'
    ],
    'table' => [
        'title' => 'Remboursement',
        'sql' => 'SELECT date_remboursement, banque, cheque_numero, montant, statut FROM remboursements ORDER BY 1 DESC LIMIT 100',
        'columns' => [
            'date_remboursement' => 'Date',
            'banque' => 'Banque',
            'cheque_numero' => 'N° chèque',
            'montant' => 'Montant',
            'statut' => 'Statut'
        ]
    ]
];

// Render the page from database-backed metadata.
render_blueprint_page($page);
