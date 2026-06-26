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
        Schema::create('remb_imp', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->foreignUuid('season_id')->nullable()->constrained('seasons')->nullOnDelete();
            $table->foreignUuid('imprimeur_id')->index()->constrained('imprimeurs')->onDelete('cascade'); // Link to Printer/Supplier
            $table->date('date_payment')->index(); // Actual payment date
            $table->string('banque_nom', 100)->nullable();
            $table->foreignUuid('banque_id')->nullable()->constrained('banques')->nullOnDelete(); //
            $table->string('cheque_number', 50)->nullable(); // Renamed from n_cheque
            $table->string('cheque_image_path')->nullable(); // Digital proof of payment
            $table->foreignUuid('rep_id')->nullable()->index();
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
            $table->decimal('montant', 15, 2); // Precise financial type
            $table->boolean('statut_recu')->default(false); //
            $table->boolean('statut_rejete')->default(false); //
            $table->boolean('statut_retourne')->default(false);
            $table->date('date_retour')->nullable();
            $table->string('motif_retour', 500)->nullable();
            $table->text('remarks')->nullable(); // Standardized from legacy 'ann'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remb_imp');
    }
};
