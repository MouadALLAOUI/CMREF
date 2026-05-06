<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add season_id and entity_type to transactional tables
        $tables = ['b_livraisons', 'b_livraison_items', 'b_ventes_clients', 'rep_remboursements', 
                  'client_remboursements', 'demande_f', 'factures', 'det_fact', 'carte_visites',
                  'cahier_communications', 'depots'];
        
        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $table) {
                    $table->foreignUuid('season_id')->nullable()->after('id')->constrained('seasons')->onDelete('set null');
                    $table->string('entity_type')->nullable()->after('season_id'); // 'MSM-MEDIAS' or 'Wataniya'
                });
            }
        }
        
        // Add last_online_at to representants
        Schema::table('representants', function (Blueprint $table) {
            $table->timestamp('last_online_at')->nullable()->after('updated_at');
        });
    }

    public function down(): void
    {
        $tables = ['b_livraisons', 'b_livraison_items', 'b_ventes_clients', 'rep_remboursements', 
                  'client_remboursements', 'demande_f', 'factures', 'det_fact', 'carte_visites',
                  'cahier_communications', 'depots'];
        
        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $table) {
                    $table->dropForeign(['season_id']);
                    $table->dropColumn(['season_id', 'entity_type']);
                });
            }
        }
        
        Schema::table('representants', function (Blueprint $table) {
            $table->dropColumn('last_online_at');
        });
    }
};
