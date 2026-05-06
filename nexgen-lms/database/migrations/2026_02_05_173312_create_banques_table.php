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
        Schema::create('banques', function (Blueprint $table) {
            $table->uuid('id')->primary(); // Using UUID to match your other tables
            $table->string('nom', 100); // e.g., "Attijariwafa Bank", "BCP"
            $table->string('code_abreviation', 10)->nullable(); // e.g., "AWB", "CIH"
            $table->string('logo_path')->nullable(); // If you want to show bank icons
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banques');
    }
};