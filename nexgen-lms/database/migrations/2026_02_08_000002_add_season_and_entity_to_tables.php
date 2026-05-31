<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add season_id and entity_type to transactional tables
        $tables = [
            'b_livraisons',
            'b_livraison_imps',
            'b_livraison_items',
            'b_ventes_clients',
            'rep_remboursements',
            'client_remboursements',
            'demande_f',
            'fact',
            'det_fact',
            'carte_visites',
            'cahier_communication',
            'depots'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $table) {
                    $table->foreignUuid('season_id')->nullable()->after('id')->constrained('seasons')->nullOnDelete();
                    $table->string('entity_type')->nullable()->after('season_id'); // 'MSM-MEDIAS' or 'Wataniya'
                });
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'b_livraisons',
            'b_livraison_items',
            'b_ventes_clients',
            'rep_remboursements',
            'client_remboursements',
            'demande_f',
            'fact',
            'det_fact',
            'carte_visites',
            'cahier_communication',
            'depots'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $table) {
                    $table->dropForeign(['season_id']);
                    $table->dropColumn(['season_id', 'entity_type']);
                });
            }
        }
    }
};
