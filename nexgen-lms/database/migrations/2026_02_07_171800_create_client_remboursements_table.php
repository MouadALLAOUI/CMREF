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
        Schema::create('client_remboursements', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID Primary Key
            $table->foreignUuid('season_id')->nullable()->constrained('seasons')->nullOnDelete();
            $table->string('entity_type')->nullable(); // 'MSM-MEDIAS' or 'Wataniya'
            $table->uuid('rep_id')->nullable()->index(); // Link to Rep
            $table->foreign('rep_id')->references('id')->on('representants')->nullOnDelete();
            $table->uuid('client_id')->nullable()->index(); // Link to Client
            $table->foreign('client_id')->references('id')->on('clients')->nullOnDelete();
            $table->date('date_payment')->index(); //
            $table->string('banque_nom', 100)->nullable();
            $table->foreignUuid('banque_id')->nullable()->constrained('banques')->nullOnDelete(); //
            $table->string('cheque_number', 50)->nullable(); //
            $table->string('cheque_image_path')->nullable(); // For digital proof
            $table->string('a_lordre_de', 255)->nullable(); // To whom the check is written
            $table->decimal('montant', 15, 2); // Financial precision
            $table->text('observation')->nullable(); //
            $table->text('remarks')->nullable(); // Standardized from 'ann'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_remboursements');
    }
};
