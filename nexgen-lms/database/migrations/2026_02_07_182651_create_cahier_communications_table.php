<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cahier_communication', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade');

            // Basic Info
            $table->string('ecole');
            $table->string('type'); // Ex: Spirale, Broché...
            $table->integer('qte')->default(0);
            $table->string('nom_fichier')->nullable();
            $table->date('date_commande');

            // Production & Design
            $table->string('bon_de_commande')->nullable();
            $table->text('indication')->nullable();
            $table->string('model_recto')->nullable();
            $table->string('model_verso')->nullable();

            // Status Flags (Converted to Booleans for React)
            $table->boolean('is_accepted')->default(false);      // acc
            $table->boolean('is_refused')->default(false);       // refu
            $table->integer('etat_model')->default(0);           // 0: pending, 1: validated, etc.
            $table->dateTime('date_validate_model')->nullable();

            // Workflow Status
            $table->boolean('is_bc_validated')->default(false);  // etat_bon_commande
            $table->boolean('is_printed')->default(false);       // imprimer
            $table->boolean('is_delivered')->default(false);     // livree
            $table->boolean('is_deleted')->default(false);       // supprimer (Soft delete flag)


            $table->text('remarques')->nullable(); // Standardisé pour 'ann'
            $table->string('annee_scolaire')->nullable();        // ann (ex: 2025/2026)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cahier_communication');
    }
};
