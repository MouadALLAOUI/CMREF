<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Fix clients.representant_id
        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign(['representant_id']);
            $table->foreign('representant_id')->references('id')->on('representants')->nullOnDelete();
        });

        // Fix depots.rep_id and depots.livre_id
        Schema::table('depots', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();

            $table->dropForeign(['livre_id']);
            $table->foreign('livre_id')->references('id')->on('livres')->nullOnDelete();
        });

        // Fix b_livraisons.rep_id
        Schema::table('b_livraisons', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
        });

        // Fix b_ventes_clients.rep_id and b_ventes_clients.client_id
        Schema::table('b_ventes_clients', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();

            $table->dropForeign(['client_id']);
            $table->foreign('client_id')->references('id')->on('clients')->nullOnDelete();
        });

        // Fix client_remboursements.rep_id and client_remboursements.client_id
        Schema::table('client_remboursements', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();

            $table->dropForeign(['client_id']);
            $table->foreign('client_id')->references('id')->on('clients')->nullOnDelete();
        });

        // Fix rep_remboursements.rep_id
        Schema::table('rep_remboursements', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
        });

        // Fix carte_visites.rep_id
        Schema::table('carte_visites', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
        });

        // Fix cahier_communication.rep_id
        Schema::table('cahier_communication', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
        });

        // Fix robots.rep_id
        Schema::table('robots', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Revert clients.representant_id
        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign(['representant_id']);
            $table->foreign('representant_id')->references('id')->on('representants')->onDelete('cascade');
        });

        // Revert depots.rep_id and depots.livre_id
        Schema::table('depots', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->onDelete('cascade');

            $table->dropForeign(['livre_id']);
            $table->foreign('livre_id')->references('id')->on('livres')->onDelete('cascade');
        });

        // Revert b_livraisons.rep_id
        Schema::table('b_livraisons', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->onDelete('cascade');
        });

        // Revert b_ventes_clients.rep_id and b_ventes_clients.client_id
        Schema::table('b_ventes_clients', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->onDelete('cascade');

            $table->dropForeign(['client_id']);
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
        });

        // Revert client_remboursements.rep_id and client_remboursements.client_id
        Schema::table('client_remboursements', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->onDelete('cascade');

            $table->dropForeign(['client_id']);
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
        });

        // Revert rep_remboursements.rep_id
        Schema::table('rep_remboursements', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->onDelete('cascade');
        });

        // Revert carte_visites.rep_id
        Schema::table('carte_visites', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->onDelete('cascade');
        });

        // Revert cahier_communication.rep_id
        Schema::table('cahier_communication', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->onDelete('cascade');
        });

        // Revert robots.rep_id
        Schema::table('robots', function (Blueprint $table) {
            $table->dropForeign(['rep_id']);
            $table->foreign('rep_id')->references('id')->on('representants')->onDelete('cascade');
        });
    }
};
