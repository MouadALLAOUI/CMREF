<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private function addIndexIfNotExists(string $table, $columns, string $name = null): void
    {
        $indexName = $name ?? (is_array($columns)
            ? $table . '_' . implode('_', $columns) . '_index'
            : $table . '_' . $columns . '_index');

        $exists = DB::select("SHOW INDEX FROM `{$table}` WHERE Key_name = ?", [$indexName]);
        if (empty($exists)) {
            Schema::table($table, function (Blueprint $table) use ($columns, $name) {
                if (is_array($columns)) {
                    $table->index($columns, $name);
                } else {
                    $table->index($columns, $name);
                }
            });
        }
    }

    private function addRawIndexIfNotExists(string $table, string $expression, string $name): void
    {
        $exists = DB::select("SHOW INDEX FROM `{$table}` WHERE Key_name = ?", [$name]);
        if (empty($exists)) {
            DB::statement("ALTER TABLE `{$table}` ADD INDEX `{$name}` ({$expression})");
        }
    }

    public function up(): void
    {
        // b_livraisons
        $this->addRawIndexIfNotExists('b_livraisons', 'annee(10)', 'bl_annee_idx');
        $this->addIndexIfNotExists('b_livraisons', 'rep_id');
        $this->addIndexIfNotExists('b_livraisons', 'date_emission');

        // b_livraison_items — livre_id (morphs index already exists)
        $this->addIndexIfNotExists('b_livraison_items', 'livre_id');

        // remb_imp
        $this->addIndexIfNotExists('remb_imp', 'annee');
        $this->addIndexIfNotExists('remb_imp', 'imprimeur_id');
        $this->addIndexIfNotExists('remb_imp', 'date_payment');

        // fact
        $this->addIndexIfNotExists('fact', 'rep_id');
        $this->addIndexIfNotExists('fact', 'year_session');
        $this->addIndexIfNotExists('fact', 'date_facture');
        $this->addIndexIfNotExists('fact', 'status');

        // det_fact
        $this->addIndexIfNotExists('det_fact', 'fact_id');
        $this->addIndexIfNotExists('det_fact', 'livre_id');

        // carte_visites
        $this->addIndexIfNotExists('carte_visites', 'rep_id');
        $this->addIndexIfNotExists('carte_visites', 'is_deleted');

        // cahier_communication
        $this->addIndexIfNotExists('cahier_communication', 'rep_id');
        $this->addIndexIfNotExists('cahier_communication', 'is_deleted');

        // client_remboursements
        $this->addIndexIfNotExists('client_remboursements', 'rep_id');
        $this->addIndexIfNotExists('client_remboursements', 'client_id');
        $this->addIndexIfNotExists('client_remboursements', 'date_payment');

        // rep_remboursements
        $this->addIndexIfNotExists('rep_remboursements', 'rep_id');
        $this->addIndexIfNotExists('rep_remboursements', 'fact_id');
        $this->addIndexIfNotExists('rep_remboursements', 'date_payment');

        // depots
        $this->addIndexIfNotExists('depots', 'rep_id');
        $this->addIndexIfNotExists('depots', 'livre_id');

        // b_ventes_clients
        $this->addIndexIfNotExists('b_ventes_clients', 'rep_id');
        $this->addIndexIfNotExists('b_ventes_clients', 'client_id');
        $this->addIndexIfNotExists('b_ventes_clients', 'date_vente');

        // clients
        $this->addIndexIfNotExists('clients', 'representant_id');

        // robots
        $this->addIndexIfNotExists('robots', 'rep_id');
        $this->addIndexIfNotExists('robots', 'statut');

        // demande_f
        $this->addIndexIfNotExists('demande_f', 'rep_id');
        $this->addIndexIfNotExists('demande_f', 'client_id');
        $this->addIndexIfNotExists('demande_f', 'statut');

        // seasons
        $this->addIndexIfNotExists('seasons', 'is_active');

        // livres
        $this->addIndexIfNotExists('livres', 'categorie_id');

        // email_logs
        $this->addIndexIfNotExists('email_logs', 'created_at');
        $this->addIndexIfNotExists('email_logs', 'statut');

        // invitations
        $this->addIndexIfNotExists('invitations', 'token');
        $this->addIndexIfNotExists('invitations', 'expires_at');
    }

    public function down(): void
    {
        $indexes = [
            'b_livraisons' => ['bl_annee_idx', 'b_livraisons_rep_id_index', 'b_livraisons_date_emission_index'],
            'b_livraison_items' => ['b_livraison_items_livre_id_index'],
            'remb_imp' => ['remb_imp_annee_index', 'remb_imp_imprimeur_id_index', 'remb_imp_date_payment_index'],
            'fact' => ['fact_rep_id_index', 'fact_year_session_index', 'fact_date_facture_index', 'fact_status_index'],
            'det_fact' => ['det_fact_fact_id_index', 'det_fact_livre_id_index'],
            'carte_visites' => ['carte_visites_rep_id_index', 'carte_visites_is_deleted_index'],
            'cahier_communication' => ['cahier_communication_rep_id_index', 'cahier_communication_is_deleted_index'],
            'client_remboursements' => ['client_remboursements_rep_id_index', 'client_remboursements_client_id_index', 'client_remboursements_date_payment_index'],
            'rep_remboursements' => ['rep_remboursements_rep_id_index', 'rep_remboursements_fact_id_index', 'rep_remboursements_date_payment_index'],
            'depots' => ['depots_rep_id_index', 'depots_livre_id_index'],
            'b_ventes_clients' => ['b_ventes_clients_rep_id_index', 'b_ventes_clients_client_id_index', 'b_ventes_clients_date_vente_index'],
            'clients' => ['clients_representant_id_index'],
            'robots' => ['robots_rep_id_index', 'robots_statut_index'],
            'demande_f' => ['demande_f_rep_id_index', 'demande_f_client_id_index', 'demande_f_statut_index'],
            'seasons' => ['seasons_is_active_index'],
            'livres' => ['livres_categorie_id_index'],
            'email_logs' => ['email_logs_created_at_index', 'email_logs_statut_index'],
            'invitations' => ['invitations_token_index', 'invitations_expires_at_index'],
        ];

        foreach ($indexes as $table => $indexNames) {
            Schema::table($table, function (Blueprint $table) use ($indexNames) {
                foreach ($indexNames as $name) {
                    $table->dropIndex($name);
                }
            });
        }
    }
};
