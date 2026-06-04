<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add NOT NULL constraints with defaults for critical business fields
        Schema::table('b_livraisons', function (Blueprint $table) {
            $table->string('bl_number', 50)->nullable(false)->change();
            $table->date('date_emission')->nullable(false)->change();
        });

        Schema::table('client', function (Blueprint $table) {
            $table->string('raison_sociale', 255)->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('b_livraisons', function (Blueprint $table) {
            $table->string('bl_number', 50)->nullable()->change();
            $table->date('date_emission')->nullable()->change();
        });

        Schema::table('client', function (Blueprint $table) {
            $table->string('raison_sociale', 255)->nullable()->change();
        });
    }
};
