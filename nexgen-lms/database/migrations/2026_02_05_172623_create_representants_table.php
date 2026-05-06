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
        Schema::create('representants', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID for security
            $table->foreignUuid('destination_id')->nullable()->constrained('destinations')->onDelete('set null');
            $table->string('nom', 255);
            $table->string('cin', 20)->unique(); // Added UNIQUE constraint
            $table->string('tel', 20)->nullable();
            $table->string('email', 255)->unique()->nullable(); // Added UNIQUE
            $table->text('adresse')->nullable();
            $table->string('code_postale', 10)->nullable();
            $table->string('ville', 100)->nullable();
            $table->string('lieu_de_travail', 255)->nullable();
            $table->string('login', 100)->unique(); // Added UNIQUE
            $table->string('password'); // Renamed from 'pass'
            $table->unsignedInteger('bl_count')->default(0); // Standardized INT
            $table->unsignedInteger('remb_count')->default(0);
            $table->timestamps(); // Added for tracking
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('representants');
    }
};
