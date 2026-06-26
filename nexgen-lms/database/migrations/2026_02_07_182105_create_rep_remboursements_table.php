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
        Schema::create('rep_remboursements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('season_id')->nullable()->constrained('seasons')->nullOnDelete();
            $table->string('entity_type')->nullable(); // 'MSM-MEDIAS' or 'Wataniya'
            $table->uuid('rep_id')->nullable()->index();
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
            $table->foreignUuid('fact_id')->nullable()->index()->constrained('fact')->nullOnDelete();
            $table->date('date_payment')->index();
            $table->foreignUuid('banque_id')->nullable()->constrained('banques')->nullOnDelete();
            $table->string('cheque_number', 50)->nullable();
            $table->string('cheque_image_path')->nullable(); // New column for the image path
            $table->foreignUuid('a_lordre_de_id')->nullable()->index();
            $table->foreign('a_lordre_de_id')->references('id')->on('imprimeurs')->nullOnDelete();
            $table->string('type_versement')->default('Versement');
            $table->string('compte')->nullable();
            $table->decimal('montant', 15, 2);
            $table->date('date_prevue')->nullable();
            $table->date('date_versement')->nullable();
            $table->boolean('statut_recu')->default(false);
            $table->boolean('statut_rejete')->default(false);
            $table->boolean('statut_accepte')->default(false);
            $table->boolean('statut_retourne')->default(false);
            $table->date('date_retour')->nullable();
            $table->string('motif_retour', 500)->nullable();

            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rep_remboursements');
    }
};