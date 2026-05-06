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
            $table->foreignUuid('rep_id')->constrained('representants')->onDelete('cascade'); // Link to Rep
            $table->foreignUuid('client_id')->constrained('clients')->onDelete('cascade'); // Link to Client
            $table->date('date_payment'); //
            $table->string('banque_nom', 100)->nullable();
            $table->foreignUuid('banque_id')->nullable()->constrained('banques')->onDelete('set null'); //
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
