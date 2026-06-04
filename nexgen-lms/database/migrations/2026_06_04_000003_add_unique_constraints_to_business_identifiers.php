<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('b_livraisons', function (Blueprint $table) {
            $table->unique('bl_number');
        });

        Schema::table('b_livraison_imps', function (Blueprint $table) {
            $table->unique('b_livraison_number');
        });
    }

    public function down(): void
    {
        Schema::table('b_livraisons', function (Blueprint $table) {
            $table->dropUnique(['bl_number']);
        });

        Schema::table('b_livraison_imps', function (Blueprint $table) {
            $table->dropUnique(['b_livraison_number']);
        });
    }
};
