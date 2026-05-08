<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/_shared/bootstrap.php';

/**
 * Dynamic PHP blueprint for safe/Fournisseurs/imp-remb.html.
 * This page keeps PHP separate from the static HTML export and uses PDO,
 * prepared statements, and htmlspecialchars() through shared helpers.
 */

// Page metadata, summary queries, filters, forms, and table columns inferred from the static UI.
$page = [
    'title' => 'Imp Remb',
    'heading' => 'Imp Remb',
    'greeting' => 'Bienvenue',
    'description' => 'Lists reimbursements from MSM-MEDIAS to suppliers. Source template: safe/Fournisseurs/imp-remb.html.',
    'summary' => [],
    'filters' => [],
    'form' => [],
    'table' => [
        'title' => 'Imp Remb',
        'sql' => 'SELECT date_remboursement, banque, cheque_numero, montant, statut FROM fournisseur_remboursements ORDER BY 1 DESC LIMIT 100',
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
