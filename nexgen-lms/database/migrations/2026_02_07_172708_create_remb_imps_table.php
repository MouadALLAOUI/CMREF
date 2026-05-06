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
            $table->foreignUuid('imprimeur_id')->constrained('imprimeurs')->onDelete('cascade'); // Link to Printer/Supplier
            $table->date('date_payment'); // Actual payment date
            $table->string('banque_nom', 100)->nullable();
            $table->foreignUuid('banque_id')->nullable()->constrained('banques')->onDelete('set null'); //
            $table->string('cheque_number', 50)->nullable(); // Renamed from n_cheque
            $table->string('cheque_image_path')->nullable(); // Digital proof of payment
            $table->decimal('montant', 15, 2); // Precise financial type
            $table->boolean('statut_recu')->default(false); //
            $table->boolean('statut_rejete')->default(false); //
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
